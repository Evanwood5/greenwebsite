#AI Coding Rules
Use this file as the default engineering standard when writing, refactoring, or reviewing code in this repository.
This project values long-term code health over quick hacks. Every change should improve maintainability, readability, performance, and scalability.
---
##Core principles
Prefer improving overall code health over shipping clever but fragile code.
Write code that is easy for another engineer to understand in one pass.
Do not duplicate logic, constants, validation, queries, or transformations.
Build for extension, not for over-engineering.
Optimize after understanding the bottleneck, not by guessing.
Keep modules small, focused, and loosely coupled.
Favor explicitness and predictability over magic behavior.
Make the safe and maintainable path the default path.
---
##What good code looks like here
Good code in this repo should be:
Readable: clear naming, simple control flow, minimal mental overhead
Reusable: shared logic extracted into focused helpers or services
Efficient: avoids unnecessary work, repeated computation, and wasteful queries
Scalable: supports growth in users, traffic, data volume, and features
Testable: business logic is easy to validate in isolation
Observable: errors are actionable and important behavior can be traced
Consistent: follows existing project patterns unless a better pattern is intentionally introduced
---
##Architecture rules
1) Single responsibility
Each file, function, class, and module should have one clear purpose.
If a function does multiple unrelated things, split it.
If a component fetches, transforms, validates, and renders, separate those concerns.
If a module becomes a dumping ground, restructure it.
2) Separation of concerns
Keep boundaries clean.
UI handles presentation and interaction
Services handle business logic
Data access layers handle persistence and external APIs
Utility modules contain small, generic helpers only
Do not mix database logic into UI code.  
Do not mix formatting logic into core business rules.  
Do not place app-specific behavior inside generic utility folders.
3) Shared logic belongs in one place
If logic appears more than once, strongly consider extracting it.
Extract shared:
validation
parsing
formatting
query building
permission checks
retry logic
error mapping
constants
type definitions
Do not wait for 5 duplicates before refactoring obvious repetition.
4) Prefer composition over deep inheritance
Favor small composable units instead of large rigid hierarchies.
5) Design for change
Assume requirements will grow.
Write code so that adding:
a new API field
a new provider
a new user role
a new page state
a new queue worker
does not require rewriting unrelated code.
---
Performance and optimization rules
1) Do not guess about performance
Only optimize when:
there is a known bottleneck
the code is clearly wasteful
scale makes the cost obvious
profiling or measurements point to the issue
2) Avoid repeated work
Watch for:
duplicate API calls
duplicate database queries
repeated parsing or serialization
repeated sorting/filtering inside loops
recomputing derived values unnecessarily
duplicate network requests across components
Cache, memoize, batch, or precompute when it meaningfully reduces cost.
3) Keep algorithmic complexity reasonable
Always think about time and space complexity when working with:
loops over large datasets
nested iteration
filtering + mapping + sorting chains
joins and aggregations
recursive logic
search-heavy paths
Avoid accidental (O(n^2)) work when (O(n)) or (O(n \log n)) is possible.
4) Optimize data access first
In many apps, the biggest performance problems come from I/O, not syntax.
Prefer:
selecting only needed fields
paginating large reads
batching writes
indexing important query paths
avoiding N+1 query patterns
pushing filtering close to the data source when appropriate
5) Protect hot paths
Anything called frequently should be especially simple and efficient.
Examples:
request handlers
render-critical code
list transforms
matching/classification logic
polling jobs
queue consumers
6) Be careful with premature abstractions
Do not introduce heavy frameworks, generic engines, or complex factories unless they solve a real repeated problem.
---
Scalability rules
When writing new code, think about what happens if usage grows 10x.
1) Expect growth
Design with growth in:
request volume
dataset size
concurrent users
background jobs
feature count
integrations
2) Keep state controlled
Minimize shared mutable state.  
Be explicit about ownership and lifecycle of state.
3) Make expensive work asynchronous when appropriate
Use background jobs, queues, or scheduled processing for work that does not need to block the user request.
4) Fail gracefully
When dependencies fail:
return useful errors
avoid silent corruption
retry only when safe
set timeouts
avoid infinite retry loops
preserve idempotency where needed
5) Design APIs and modules with stable contracts
Avoid unnecessary breaking changes in:
function signatures
response shapes
event payloads
shared interfaces
6) Keep scaling options open
Do not tightly couple code to one storage model, vendor, or runtime unless that choice is deliberate and worth it.
---
Anti-duplication rules
Duplication is not just copy-pasted code. It also includes repeated ideas.
Watch for repeated:
business rules
magic strings
enum values
status mapping
regex patterns
validation logic
permission checks
fallback behavior
SQL fragments
response shaping
error handling patterns
Bad
Same validation copied across routes
Same status strings typed in five files
Same transformation logic repeated in frontend and backend without a shared contract
Better
One shared validator
One source of truth for constants
One mapping layer for external/internal shapes
One typed contract used across boundaries when possible
---
Simplicity rules
Prefer the simplest solution that correctly solves the problem.
Prefer short functions with clear names.
Avoid deeply nested conditionals when guard clauses can simplify flow.
Avoid clever one-liners that reduce readability.
Avoid abstractions that hide important behavior.
Keep files from growing without bound.
A future engineer should be able to answer:
what this does
why it exists
where to change it
without reverse-engineering the whole system.
---
Function and module guidelines
Functions should:
do one thing well
have clear input/output behavior
avoid hidden side effects
return predictable shapes
be easy to test
Modules should:
have a focused purpose
expose a small public surface
hide internal implementation details
avoid circular dependencies
File size guideline
If a file becomes hard to scan quickly, split it by responsibility.
---
Naming rules
Choose names that reveal intent.
Prefer:
`calculateMatchScore`
`fetchActiveJobs`
`normalizeApplicantRecord`
Avoid vague names like:
`handleData`
`processThing`
`temp`
`misc`
`newLogic`
Names should reflect domain meaning, not just technical mechanics.
---
Error handling rules
Fail loudly enough to debug, but not noisily enough to hide the signal.
Never swallow errors without a reason.
Add context to errors near system boundaries.
Normalize error handling for repeated patterns.
Use user-friendly messages externally and detailed messages internally.
Validate early.
---
Testing rules
Test behavior that matters, especially around:
business rules
edge cases
transformations
permissions
error paths
performance-sensitive logic
regression-prone areas
Prefer a small number of meaningful tests over many shallow tests.
Write tests for:
expected cases
boundary cases
invalid input
empty states
failure handling
When fixing a bug, add or update a test that would have caught it.
---
Comments and documentation
Comments should explain why, not restate what obvious code already says.
Good reasons for comments:
non-obvious tradeoff
workaround
performance constraint
business rule
external system behavior
safety reason
Keep docs updated when changing:
architecture
setup
public interfaces
environment behavior
operational workflows
---
AI-specific instructions
When using AI to generate or modify code for this repo:
Always do this
follow existing project patterns first
reuse existing helpers before creating new ones
search for similar logic before adding code
preserve clear boundaries between layers
prefer incremental changes over large rewrites
keep changes reviewable
explain tradeoffs when introducing a new abstraction
call out performance risks, duplication risks, and scaling risks
Never do this
introduce duplicate utilities with slightly different names
create parallel patterns when one already exists
add unused abstractions "for future flexibility"
over-nest components, services, or folders
make broad refactors without clear payoff
add dependencies for minor convenience
optimize blindly without evidence
hide important logic inside generic helper names
Before writing code, check:
Does this already exist somewhere?
Can I extend an existing module instead of creating a new one?
Will this increase or reduce duplication?
Is this the simplest maintainable solution?
What happens when the dataset or traffic grows?
Is there a clearer boundary for this logic?
Can this be tested easily?
---
Pull request expectations
Every PR should aim to improve overall code health.
A good PR:
solves one focused problem
keeps the diff understandable
avoids unrelated cleanup unless it helps the change
includes tests when behavior changes
updates docs when interfaces or workflows change
explains non-obvious design choices
Before merging, ask:
Is the design clear?
Is there duplicated logic?
Is the code simpler than before?
Is performance acceptable for expected scale?
Will this be easy to modify later?
---
Preferred decision order
When multiple solutions are possible, prefer this order:
Correctness
Simplicity
Maintainability
Reuse
Observability
Performance
Flexibility
Do not sacrifice correctness or maintainability for micro-optimizations.
---
Short review checklist
Use this checklist before finalizing code:
[ ] No obvious duplicated logic or constants
[ ] Clear names and boundaries
[ ] Small focused functions/modules
[ ] Correctness covered by tests or reasoning
[ ] No unnecessary queries, loops, or recomputation
[ ] Works for larger input sizes or higher traffic
[ ] Errors handled clearly
[ ] Docs/comments updated if needed
[ ] Matches existing project conventions
[ ] Improves overall code health
---
One-sentence standard
Write code that is clear today, efficient under load, easy to extend tomorrow, and never duplicated without a strong reason.