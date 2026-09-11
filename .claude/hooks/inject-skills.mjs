#!/usr/bin/env node
// UserPromptSubmit hook: injects the content of every .claude/skills/*/SKILL.md
// into context so Claude sees this project's skill conventions on every turn,
// not only when a skill's description happens to trigger it.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const skillsDir = join(projectRoot, '.claude', 'skills')

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
