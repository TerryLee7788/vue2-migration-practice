---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(npm run build:*), Grep(*), Glob(*), Read(*), Agent
description: 每輪遷移掃描——找出還沒轉成 Composition API 的檔案，依序交給 frontend-migrator / state-architect / qa-reviewer / ui-agent / docs-sync 處理，並把結果寫進執行紀錄。不會自動 commit / push。
argument-hint: [可選：指定只處理某個檔案，例如 src/components/CustomInput.vue]
---

## Context（先蒐集現況，不要用記憶或猜測）

尚未轉換的 Options API 檔案：!`grep -rl "export default {" src/ 2>/dev/null || echo "(none found)"`
README 對照表目前有幾個遷移點：!`grep -c "✅ 遷移點" README.md`
程式碼裡目前有幾個遷移點註解：!`grep -rn "遷移點" src/ 2>/dev/null | wc -l`
目前 git 狀態：!`git status --short`

使用者/呼叫者指定的檔案（可能為空，空的話取上面清單第一個）：$ARGUMENTS

## 任務

依序執行以下步驟。每一步都用 Agent tool 呼叫對應名稱的 subagent（`.claude/agents/` 底下已定義），
把上一步的回報內容當作下一步的輸入——subagent 之間沒有共享 context，所有「溝通」都要靠你在這裡
轉述，以及它們實際寫到的檔案（程式碼 diff、README、下面的執行紀錄檔）。

1. **判斷這輪要不要做事**：如果 Context 裡「尚未轉換的 Options API 檔案」是空的，而且沒有指定
   `$ARGUMENTS`，代表沒有遷移工作可做——直接把「本輪無事可做」寫進執行紀錄（見步驟 6），結束，
   不要往下跑。

2. **frontend-migrator**：交付目標檔案，請它把 Options API 改寫成 Composition API
   `<script setup>`。記下它回報的：改了哪個檔案、對應第幾個遷移點、有沒有牽動 store。

3. **state-architect**（僅在步驟 2 回報「牽動 store」時執行）：把步驟 2 的改動摘要交給它，
   請它確認 `src/store/index.js` 的對應邏輯是否需要調整。

4. **qa-reviewer**：請它跑 `npm run build` + grep 檢查清單。
   - 如果回報有問題 → 把問題內容交還給 `frontend-migrator` 修正，最多重試 1 次，仍失敗就中止
     這輪、如實記錄失敗原因（不要硬把壞掉的狀態當成功寫進紀錄）。
   - 通過就繼續下一步。

5. **ui-agent**：告訴它這輪改了哪個檔案、對應哪個路由，請它啟動 dev server、實際操作一次並
   截圖驗證。
   - 如果它回報「沒有瀏覽器可用，這輪跳過視覺驗證」→ 照實記錄，不算失敗，繼續下一步。
   - 如果它回報視覺/互動異常 → 交還給 `frontend-migrator` 修正，最多重試 1 次。

6. **docs-sync**：把這輪實際發生的變動（改了哪個檔案、對應第幾個遷移點、是否新增了遷移點編號）
   交給它，請它同步 `README.md` 對照表跟 `✅ 遷移點 N` 註解文字。

7. **寫執行紀錄**：把這輪結果 append 進 `.claude/agents/run-log.md`（沒有這個檔案就先建立，
   標題用 `## <ISO 時間戳>`）。內容至少包含：處理了哪個檔案、build 有沒有過、UI 驗證結果、
   README 有沒有更新、有沒有需要人工介入的地方。

## 不要做的事

- 不要自動 `git add` / `git commit` / `git push` / 開 PR——這些照 `.claude/commands/commit-pr.md`
  的規則，需要使用者在對話裡明確同意才能做。這個 command 只負責「持續發現＋改程式碼＋記錄」。
- 不要一次處理多個檔案——一輪只處理一個，避免單次 diff 太大不好審查、也避免 subagent 之間互相
  踩到彼此正在改的檔案。
- 不要在 subagent 回報有問題時自己動手改——退回給對應角色的 subagent 處理，維持職責邊界。
