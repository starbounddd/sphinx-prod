# Tasks

## Scope
- Build an AI healthcare workflow-shortening assistant in this repository, extending existing assessment/screening/provider flows and delivering in branch `feature/ai-assessment-chat`.
- Enforce autonomous governance with supervisor verification (`tasks.md`, `changelogs.md`, `verify.md`).

## Todo
- [x] T1: Baseline audit + architecture plan for AI assessment chat flow
  - Owner: worker
  - Required MCP: none
  - Deliverable: architecture/design decisions appended to `changelogs.md`
  - Verify: presence of DESIGN + decisions block for T1
  - DoD: clear data flow, safety constraints, and integration points documented
  - Verified: `verify.md` PASS entry dated 2026-02-28

- [x] T2: Backend TDD implementation for AI assessment chat APIs/services
  - Owner: worker
  - Required MCP: none
  - Deliverable: failing tests first, then implementation + passing tests
  - Verify: test command(s) in HOW_TO_VERIFY and green output
  - DoD: backend behavior covered by tests and passing locally
  - Verified: `verify.md` PASS entry dated 2026-02-27/28

- [ ] T3: Frontend implementation for assessment chat UX
  - Owner: worker
  - Required MCP: Browser MCP (Playwright preferred)
  - Deliverable: UI pages/components integrated into existing app routes with a11y + performance considerations
  - Verify: lint/build plus Browser MCP validation steps
  - DoD: working chat flow from UI to backend with policy-compliant DESIGN section

- [ ] T4: Integration hardening + docs
  - Owner: worker
  - Required MCP: none
  - Deliverable: integration notes, env expectations, and usage docs updated
  - Verify: build/lint and docs presence checks
  - DoD: feature is runnable by another engineer without hidden steps

- [ ] T5: Supervisor verification + completion marking
  - Owner: supervisor
  - Required MCP: none
  - Deliverable: PASS/FAIL entries in `verify.md` for all tasks; checkboxes updated only after PASS
  - Verify: each checked task references verify entry
  - DoD: all completed tasks have objective PASS evidence

## Acceptance Rules
- `verify.md` PASS is required before any task can be checked `[x]`.
- Worker can append only to `changelogs.md`.
- Worker must not modify `tasks.md` / `verify.md`.
- Supervisor reads `changelogs.md` as append-only history.
- Frontend must follow: DESIGN -> development -> Browser MCP verification.
- Backend must follow TDD: failing test -> implementation -> pass -> refactor.
- Recovery events (rate limit/quota/session crash) must be logged in `verify.md`.
