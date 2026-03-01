// tests/pipeline/pipeline.test.ts
// Orchestrator: imports all 3 phases in order within a single process.
// This ensures sharedState (module-scoped) persists across phases
// and the LangGraph in-memory checkpointer retains conversation state.
//
// Run with: npx vitest run tests/pipeline/pipeline.test.ts --test-timeout 180000

import './01-screening';
import './02-assessment';
import './03-report';
