#!/usr/bin/env node
// Stop hook: runs `npm run build` once per assistant turn (not once per edit,
// which is what a PostToolUse hook on Edit/Write would do and would both
// over-run during multi-file changes and false-positive on intermediate,
// intentionally-incomplete states). Silent on success so it costs no tokens;
// on failure it blocks the turn from ending and feeds the build output back
// so the failure gets fixed without a manual "please check the build" round trip.
import { execSync } from 'node:child_process'

const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const MAX_OUTPUT_CHARS = 4000

try {
  execSync('npm run build', { cwd: projectRoot, stdio: 'pipe', timeout: 120000 })
  process.stdout.write('{}')
} catch (err) {
  const combined = `${err.stdout || ''}${err.stderr || ''}`.toString()
  const output = combined.length > MAX_OUTPUT_CHARS ? combined.slice(-MAX_OUTPUT_CHARS) : combined

  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: 'npm run build 失敗，請先修好再結束這一輪：\n\n' + output
    })
  )
}
