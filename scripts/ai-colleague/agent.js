#!/usr/bin/env node
// AI 同事：常駐版。npm run ai:chat 啟動一個會保留記憶、且會主動盯著 src/ 檔案變動的聊天 agent。
// 跟 migrate-component.js（一次性、跑完就結束）不同，這支會一直開著等你打字，
// 對話記憶存在 scripts/ai-colleague/.memory/conversation.json，關掉再開也接得回去。
//
// 用法：npm run ai:chat
// Slash 指令：
//   /read <路徑>   把檔案內容貼進對話，讓它有上下文可以討論（例如 /read src/views/Cart.vue）
//   /reset         清空目前的對話記憶
//   /exit          離開

import { createInterface } from 'node:readline/promises'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync, watch } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..', '..')
const memoryDir = resolve(__dirname, '.memory')
const memoryFile = resolve(memoryDir, 'conversation.json')
const MODEL = 'claude-sonnet-5'
const MAX_TURNS_SENT = 20

async function loadSystemPrompt() {
  const [claudeMd, skillMd] = await Promise.all([
    readFile(resolve(projectRoot, 'CLAUDE.md'), 'utf-8'),
    readFile(resolve(projectRoot, '.claude/skills/vue3-frontend-conventions/SKILL.md'), 'utf-8')
  ])
  return `你是這個 repo（vue2-migration-practice）的 AI 開發同事，常駐在這個終端機聊天視窗裡，
跟使用者討論 Vue 2 → Vue 3 遷移相關的問題。以下是這個專案的慣例文件，回答時要遵守：

=== CLAUDE.md ===
${claudeMd}

=== .claude/skills/vue3-frontend-conventions/SKILL.md ===
${skillMd}

你目前沒有直接改檔案的能力，只能聊天討論、給建議、看使用者用 /read 指令貼進來的檔案內容。
若使用者要你真的動手改檔案，提醒他們可以用 npm run ai:migrate -- <路徑> --apply，或請 Claude Code 動手。`
}

async function loadMemory() {
  if (!existsSync(memoryFile)) return []
  return JSON.parse(await readFile(memoryFile, 'utf-8'))
}

async function saveMemory(history) {
  await mkdir(memoryDir, { recursive: true })
  await writeFile(memoryFile, JSON.stringify(history, null, 2), 'utf-8')
}

// Anthropic API 要求訊息角色要交替，/read 可能連續推進兩個 user 輪次，
// 送出前把連續同角色的訊息合併成一則，避免 400 錯誤。
function mergeConsecutiveRoles(messages) {
  const merged = []
  for (const msg of messages) {
    const last = merged[merged.length - 1]
    if (last && last.role === msg.role) {
      last.content += '\n\n' + msg.content
    } else {
      merged.push({ role: msg.role, content: msg.content })
    }
  }
  return merged
}

// rl.close() 觸發的 'close' 事件跟我們自己排隊處理中的非同步指令是各自獨立的時序，
// 指令做到一半時 interface 可能已經被關閉，這時再呼叫 rl.prompt() 會丟
// ERR_USE_AFTER_CLOSE，所以所有要顯示 prompt 的地方都要先確認 rl 還開著。
function promptIfOpen(rl, preserveCursor) {
  if (!rl.closed) rl.prompt(preserveCursor)
}

// 主動做事的部分：盯著 src/ 底下的 .vue 檔案，存檔時如果發現還是 Options API 就主動提醒。
function watchForOptionsApi(rl) {
  const srcDir = resolve(projectRoot, 'src')
  return watch(srcDir, { recursive: true }, async (_event, filename) => {
    if (!filename || !filename.endsWith('.vue')) return
    const filePath = resolve(srcDir, filename)
    if (!existsSync(filePath)) return

    try {
      const content = await readFile(filePath, 'utf-8')
      if (content.includes('export default {')) {
        const relPath = relative(projectRoot, filePath).replace(/\\/g, '/')
        console.log(`\n🔔 [主動提醒] ${relPath} 還是 Options API，要不要請我幫你轉成 Composition API？（輸入 /read ${relPath} 讓我看內容）`)
        promptIfOpen(rl, true)
      }
    } catch {
      // 檔案可能剛好在被移除/改名，忽略這次事件即可
    }
  })
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('缺少 ANTHROPIC_API_KEY。請先設定環境變數，或建立 .env.local（此指令會自動載入）。')
    process.exit(1)
  }

  const system = await loadSystemPrompt()
  const history = await loadMemory()
  const client = new Anthropic()

  console.log('🤖 AI 同事已上線（/exit 離開、/reset 清空記憶、/read <路徑> 貼入檔案內容）')
  if (history.length > 0) {
    console.log(`   已讀取上次的對話記憶（${history.length} 則）`)
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: '你> ' })
  const watcher = watchForOptionsApi(rl)
  rl.prompt()

  // 逐行序列化處理：readline 的 'line' 事件對每一行都是各自觸發的 async callback，
  // 如果使用者連續貼上多行（例如 /read 後面馬上接 /exit），/exit 可能會搶在
  // /read 的檔案寫入完成前就關閉行程。用一條 promise 鏈把每一行排隊處理，
  // 確保上一行的非同步工作做完才會處理下一行。'close' 事件（不管是 /exit 觸發，
  // 還是 stdin 直接 EOF）也要等這條 queue 跑完才能真的離開，不然一樣會搶跑。
  let queue = Promise.resolve()
  rl.on('line', (line) => {
    queue = queue.then(() => handleLine(line))
  })

  async function handleLine(line) {
    const input = line.trim()

    if (input === '/exit') {
      rl.close()
      return
    }

    if (input === '/reset') {
      history.length = 0
      await saveMemory(history)
      console.log('已清空對話記憶。')
      promptIfOpen(rl)
      return
    }

    if (input.startsWith('/read ')) {
      const target = input.slice('/read '.length).trim()
      try {
        const content = await readFile(resolve(projectRoot, target), 'utf-8')
        history.push({ role: 'user', content: `這是 ${target} 的內容：\n\n${content}` })
        await saveMemory(history)
        console.log(`已把 ${target} 的內容加入對話上下文。`)
      } catch (err) {
        console.error(`讀取失敗：${err.message}`)
      }
      promptIfOpen(rl)
      return
    }

    if (!input) {
      promptIfOpen(rl)
      return
    }

    history.push({ role: 'user', content: input })

    const recent = mergeConsecutiveRoles(history.slice(-MAX_TURNS_SENT))
    process.stdout.write('AI> ')
    let reply = ''
    try {
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 2048,
        system,
        messages: recent
      })
      stream.on('text', (delta) => {
        reply += delta
        process.stdout.write(delta)
      })
      await stream.finalMessage()
    } catch (err) {
      console.error(`\n[錯誤] ${err.message}`)
    }
    process.stdout.write('\n')

    history.push({ role: 'assistant', content: reply })
    await saveMemory(history)
    promptIfOpen(rl)
  }

  rl.on('close', async () => {
    await queue
    watcher.close()
    console.log('\n👋 AI 同事下線了，記憶已保留，下次啟動會接續。')
    // 刻意不呼叫 process.exit()：呼叫過 API 後，Anthropic SDK 底層的 HTTP handle
    // 有時還在收尾，這時強制 process.exit() 在 Windows 上會撞上 libuv 的
    // UV_HANDLE_CLOSING 斷言而整個 crash。關掉 rl／watcher 之後不再有事情要做，
    // 讓 Node 事件迴圈自然淨空、自己結束即可。
  })
}

main().catch((err) => {
  console.error('執行失敗：', err.message)
  process.exit(1)
})
