#!/usr/bin/env node
// AI 同事：一個真的會動手改程式碼的小工具，而不是給使用者聊天用的機器人。
// 用法：npm run ai:migrate -- <元件路徑> [--apply]
//   不加 --apply：只印出改寫前後的 diff（預覽）。
//   加 --apply：把改寫結果寫回原檔案。
//
// 它會把 CLAUDE.md 跟 vue3-frontend-conventions skill 的內容一併餵給 Claude，
// 讓它照著這個 repo 既有的慣例，把一個 Options API 元件改寫成 Composition API。

import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'
import { createTwoFilesPatch } from 'diff'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..', '..')
const MODEL = 'claude-sonnet-5'

function printUsage() {
  console.error('用法：npm run ai:migrate -- <元件路徑> [--apply]')
  console.error('範例：npm run ai:migrate -- src/components/ProductRow.vue --apply')
}

function stripCodeFence(text) {
  return text
    .trim()
    .replace(/^```[a-z]*\n/i, '')
    .replace(/\n```$/, '')
}

function buildSystemPrompt(claudeMd, skillMd) {
  return `你是這個 repo 的 AI 開發同事，任務是把使用者指定的 Vue 2 風格 Options API 元件改寫成
Vue 3 Composition API（<script setup>），並嚴格遵守以下這個專案自己的慣例文件。

=== CLAUDE.md ===
${claudeMd}

=== .claude/skills/vue3-frontend-conventions/SKILL.md ===
${skillMd}

改寫規則：
1. 只輸出改寫後的「完整檔案內容」，不要加任何說明文字，也不要用 markdown code fence 包起來。
2. 元件一律用 <script setup> + Composition API（ref/reactive/computed/watch/onMounted/onBeforeUnmount…）。
3. 需要用到 store/router 時用 useStore()/useRouter()，不要用 this.$store/this.$route/this.$router。
4. 若元件需要跨元件共用邏輯或全域方法（例如 $log、$bus），比照 src/composables/useLogger.js 的
   composable 模式，或直接 import 對應的原始值（例如 src/eventBus.js 匯出的 EventBus）。
5. 保留檔案裡既有的「✅ 遷移點 N：...」註解，並把說明文字同步改成 Composition API 的對應寫法，
   不要整段刪除，也不要留著只描述 Options API 寫法的舊文字。
6. 依照這個 repo 既有的慣例（可參考 src/views/Cart.vue、src/views/ProductList.vue 的做法），
   把原本的 Options API 版本完整保留、註解掉，放在新的 <script setup> 區塊下方，方便對照練習。
7. 不要引入 Pinia，不要改動 Vuex store 本身的寫法，也不要動 router 設定的寫法。`
}

async function main() {
  const [, , targetArg, ...rest] = process.argv
  if (!targetArg) {
    printUsage()
    process.exit(1)
  }
  const apply = rest.includes('--apply')

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('缺少 ANTHROPIC_API_KEY。請先設定環境變數，或建立 .env.local（此指令會自動載入）。')
    process.exit(1)
  }

  const targetPath = resolve(process.cwd(), targetArg)
  const [originalCode, claudeMd, skillMd] = await Promise.all([
    readFile(targetPath, 'utf-8'),
    readFile(resolve(projectRoot, 'CLAUDE.md'), 'utf-8'),
    readFile(resolve(projectRoot, '.claude/skills/vue3-frontend-conventions/SKILL.md'), 'utf-8')
  ])

  if (!originalCode.includes('export default {')) {
    console.warn('⚠️  這個檔案看起來已經沒有 Options API 的 export default {...}，仍會嘗試請 AI 改寫。')
  }

  console.log(`正在請 ${MODEL} 改寫 ${targetArg} ...`)

  const client = new Anthropic()
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: buildSystemPrompt(claudeMd, skillMd),
    messages: [
      { role: 'user', content: `請把以下檔案（路徑：${targetArg}）改寫成 Composition API：\n\n${originalCode}` }
    ]
  })

  const newCode = stripCodeFence(
    response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
  )

  const patch = createTwoFilesPatch(targetArg, targetArg, originalCode, newCode, '改寫前', '改寫後')
  console.log('\n' + patch)

  if (apply) {
    await writeFile(targetPath, newCode, 'utf-8')
    console.log(`✅ 已寫回 ${targetArg}`)
  } else {
    console.log('這只是預覽（dry run），加上 --apply 才會真的寫回檔案，例如：')
    console.log(`  npm run ai:migrate -- ${targetArg} --apply`)
  }
}

main().catch(err => {
  console.error('執行失敗：', err.message)
  process.exit(1)
})
