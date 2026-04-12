Run `git status --short` to get the list of modified/untracked files.

Present the files to the user as a numbered list and ask them to pick files to stage one by one by number (or multiple at once, comma-separated). Show the running list of selected files after each pick. Include a "done" option at each step.

Once the user says "done":
1. Run `git diff` and `git diff --cached` on the selected files to understand the changes
2. Write a concise commit message (imperative mood, under 72 chars) summarizing what changed and why
3. Show the user the proposed commit message and ask for approval or edits
4. Once approved, stage the selected files with `git add` and create the commit using the approved message, ending with:

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

Do NOT push after committing.
