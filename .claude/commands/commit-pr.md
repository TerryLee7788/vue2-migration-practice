---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh pr list:*)
description: 檢查目前異動、判斷要不要拆成多筆 commit，再依 GitHub PR 規範完成 commit（以及視需要的 push / 開 PR）
argument-hint: [可選：PR 標題、"不用拆直接 commit" 之類的補充指示]
---

## Context（先蒐集現況，不要用記憶或猜測）

- 目前狀態：!`git status`
- 完整 diff（staged + unstaged）：!`git diff HEAD`
- 每個檔案的異動量：!`git diff --stat HEAD`
- 目前分支：!`git branch --show-current`
- 近期 commit 訊息風格（沿用這個 repo 既有的前綴/語氣）：!`git log --oneline -10`

使用者補充指示（可能為空）：$ARGUMENTS

## Your task

### 1. 判斷「異動是否太多，需要拆成多筆 commit」

用以下訊號判斷，符合兩項以上就算「太多」：
- 改動涉及兩個以上互不相關的關注點（例如同時動到「表單驗證邏輯」「組態設定」「樣式系統」）
- 改動的檔案分屬明顯不同的目錄/模組，彼此沒有直接依賴
- 其中包含「新增依賴／建置工具變更」跟「一般功能程式碼」混在一起
- 有明顯可獨立成立、各自能讀懂的邏輯單元（例如先加一個 util function、再讓呼叫端改用它 ——
  這其實是兩個可以分開審的動作）
- diff 內容雜到光看 `git diff --stat` 的檔案清單就分不出「這一包到底想做什麼」

若使用者在 `$ARGUMENTS` 裡已經明講不用拆（例如「不用拆，直接一個 commit」），就尊重指示，跳到
步驟 3。

### 2. 太多的話：先提方案、等確認，不要自己先斬後奏

- 條列你建議的拆分方案：每個 commit 的範圍、包含哪些檔案、commit message 草稿。
- Commit message 延續步驟 Context 裡 `git log` 看到的既有風格（這個 repo 目前是
  Conventional Commits 風格，如 `feat: ...` / `chore: ...`）。
- 若這個 repo 有 `CLAUDE.md`／`.claude/skills/` 之類的專案慣例（例如程式碼撰寫風格限制、
  特殊註解標記慣例），確認拆分後的每個 commit 訊息與範圍不會違背這些慣例。
- 把方案講給使用者聽，明確問「要照這樣拆嗎？」，取得同意後才動手。
- 同意後，用 `git add <明確列出的檔案>`（**不要** `git add -A` 或 `git add .`）依序分批
  `git commit`，確保每個 commit 都是獨立、可讀的最小單位。

### 3. 不算太多的話：走單一 commit 流程

- 直接 `git add <相關檔案>`，用一個訊息完成 commit。

### 4. 撰寫 commit message 的規則

- 第一行：簡短祈使句，延續既有前綴風格，避免超過約 72 字元。
- 需要時空一行後補充「為什麼這麼改」，而不是重複 diff 就看得到的「做了什麼」。
- 用 heredoc 傳遞訊息，避免多行內容被 shell 錯誤轉義：
  ```bash
  git commit -m "$(cat <<'EOF'
  <標題>

  <內文，選填>
  EOF
  )"
  ```
- 若 staged 的檔案清單裡出現看起來像密鑰／憑證的檔案（`.env`、`*.pem`、`credentials*` 等），
  停下來提醒使用者，不要直接 commit 進去。

### 5.（可選）Push 與開 PR —— 只有使用者明確要求才做

- 確認分支不是 `main`/`master`；若目前在 `main` 上，先建立新分支再 push。
- 用 `git log [base]...HEAD` 與 `git diff [base]...HEAD` 檢視「這個 PR 會包含的所有
  commit」，不是只看最後一次 commit。
- PR 標題 <70 字元，內文固定用：
  ```
  ## Summary
  - ...

  ## Test plan
  - [ ] ...
  ```
- 用 `gh pr create --title "..." --body "$(cat <<'EOF' ... EOF)"` 建立 PR。
- push / 開 PR 前，先把打算做的事（分支名稱、要 push 的 commit、PR 標題與內容）講給使用者看，
  得到明確同意再執行 —— 這兩個動作影響共享狀態，不能自動做。

### 安全原則（沿用一般 Git Safety Protocol，不可省略）

- 不加 `--no-verify` / `--no-gpg-sign`，除非使用者明講要跳過。
- 不對已存在的 commit 用 `--amend`，除非使用者明講。
- 不對 `main`/`master` 做 `push --force`。
- 每次 staging 前先看過會加進去的檔案清單，不要用會整包吃下所有變動的指令。
- 過程中若發現不熟悉的檔案／分支／設定（看起來像使用者手上還沒處理完的東西），先弄清楚是什麼
  再決定要不要動它，不要直接覆蓋或刪除。
