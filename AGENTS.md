# Agent instructions

Read this file before working in this repository. Also see README.md.

## Engineering standards

These apply to every agent (Codex, Claude, others) and every person, and they come before new feature work. Open clean-up work is in milestone *M0 — Engineering foundations* (#70 #71 #72 #73).

**Small changes, merged often**
- One issue, one short-lived branch off the default branch in its own worktree, one PR. Aim for about 400 changed code lines or fewer, excluding generated files and lockfiles. One purpose per PR. Merge within a day or two.
- No long-lived integration branches, and no stacks deeper than about 3 PRs. A PR open more than 7 days gets rebased, split or closed.
- The default branch always builds and passes tests.

**No data in git**
- Git holds code, configs, schemas and tiny test fixtures (under about 1 MB each). Raw or processed data, large outputs, binaries, notebooks with big outputs, HPC logs and build artefacts live in external storage (Imperial RDS project space, an object store, or release assets). A small manifest stays in git: path or URL, size, sha256, provenance.
- A large-file check runs on pre-commit and in CI. Don't bypass it; add a justified allowlist entry instead.
- Never rewrite published history, force-push, or delete data without Nathan's explicit OK.

**Issue-driven**
- Every PR links an issue in a milestone. Update the issue when work starts and when it lands. Close it with `Closes #N` only when its acceptance criteria are verified. Split any remainder into a new issue rather than leaving the original open.
- Consolidate duplicates. Don't let open issues pile up.

**Checks that actually run**
- CI, or the local pre-merge script when CI is unavailable, runs lint, type checks and tests on every change. Pin the Python (conda env in conda/) and Node versions. Commit lock files.
- Never weaken, skip or delete tests to go green.

**Tests over paperwork**
- Progress means working, user-visible features verified by tests or end-to-end checks, not record, receipt or evidence commits. At most 1 in 5 commits on a PR may be process documentation. Prefer one concise STATUS.md over growing logs.
- Honest data: no placeholder or mock numbers presented as real. Synthetic data is visibly labelled.

**Review and hygiene**
- A different agent or model reviews each PR before merge (for example, Codex reviews Claude and Claude reviews Codex). Findings become issues. Agents don't merge their own PRs without that review.
- Remove worktrees and branches once merged or abandoned. Each agent has at most 3 active worktrees per repo. Close superseded PRs. Everything is pushed to the remote.
- Repository visibility is changed only by Nathan. Never add credentials, personal data or unpublished lab data: this repository is public.

