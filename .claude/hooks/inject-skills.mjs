#!/usr/bin/env node
// UserPromptSubmit hook: injects the content of every .claude/skills/*/SKILL.md
// into context, but only when the prompt looks related to Vue component/view/
// store/router work — this file's SKILL.md is ~150 lines and was previously
// injected unconditionally on every single turn, which was the single largest
// recurring token cost in this repo (see .claude/agents/run-log.md-style
// feedback: user flagged this after noticing high per-turn token burn).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const skillsDir = join(projectRoot, '.claude', 'skills')

const RELEVANCE_KEYWORDS = [
  // 中文
  '元件', '頁面', '路由', '插槽', '過濾器', '遷移', '遷移點', '購物車', '狀態管理',
  // Vue/Vuex/Router API surface
  'vue3', 'vue 3', 'vue2', 'vue 2', 'vuex', 'v-model', 'v-slot', 'slot-scope',
  'script setup', 'options api', 'composition api', 'defineprops', 'defineemits',
  'definemodel', 'defineoptions', 'useattrs', 'usestore', 'useroute', 'userouter',
  '$attrs', '$listeners', '$bus', '$store', '$route', '$router', 'eventbus',
  'event bus', 'mixin', 'composable', 'reactive', 'computed(', 'watch(',
  // repo paths / workflow names that only matter for frontend work
  '.vue', 'src/components', 'src/views', 'src/store', 'src/router',
  'src/composables', 'migration-sweep', 'frontend-migrator', 'state-architect'
]

function isFrontendRelevant(prompt) {
  if (!prompt) return true // no prompt text available — fail open, inject as before
  const lower = prompt.toLowerCase()
  return RELEVANCE_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()))
}

function readHookInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return {}
  }
}

const hookInput = readHookInput()

if (!isFrontendRelevant(hookInput.prompt)) {
  process.stdout.write('{}')
  process.exit(0)
}

function findSkillFiles(dir) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return []
  }
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      const skillMd = join(full, 'SKILL.md')
      try {
        statSync(skillMd)
        files.push(skillMd)
      } catch {
        // no SKILL.md in this directory, skip
      }
    }
  }
  return files
}

const skillFiles = findSkillFiles(skillsDir)

if (skillFiles.length === 0) {
  process.stdout.write('{}')
  process.exit(0)
}

const sections = skillFiles.map((file) => {
  const relPath = file.slice(projectRoot.length + 1).replace(/\\/g, '/')
  const content = readFileSync(file, 'utf8')
  return `--- ${relPath} ---\n${content}`
})

const additionalContext =
  '以下是這個專案 .claude/skills/ 底下的 skill 檔案內容，請在本次回應中遵守其中的慣例：\n\n' +
  sections.join('\n\n')

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext
  }
}

process.stdout.write(JSON.stringify(output))
