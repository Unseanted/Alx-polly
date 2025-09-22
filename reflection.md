AI’s Impact on Building ALX Polly

Working with an AI pair programmer on ALX Polly meaningfully accelerated the build, especially for boilerplate and repetitive tasks. Generating typed client helpers for endpoints like `/Poll/{id}`, `/polls?skip&limit`, voting, and results retrieval was fast and consistent. The AI kept type shapes coherent across `types/poll.ts` and `lib/polls.ts`, and it pushed toward input validation and defensive parsing (e.g., `parsePoll`, `parsePollPage`, `parsePollResults`). This reduced subtle bugs and gave the client a reliable contract, even when the backend response shape might vary.

What worked well
- Rapid scaffolding: Creating routes, typed helpers, and README documentation was quick. The AI’s ability to propose sane defaults (status handling, JSON parsing, clear error messages) saved time.
- Defensive client design: Encouragement to validate response shapes and normalize data upfront led to clearer failure modes. Returning `null` on 404 for `getPollById`, and throwing informative errors elsewhere, created a predictable API surface.
- Incremental iteration: The AI adapted as features expanded—adding pagination, voting, and results parsing without large refactors. Each function followed similar structure and headers, keeping code quality steady.
- UX-minded utilities: The `getDisplayName` fallback to "Guest" is a small but important touch. The AI surfaced the UX rationale and documented where it applies (headers, greetings), helping maintain consistency.

What felt limiting
- Missing global context: Without a live backend spec in-repo, the AI had to generalize endpoints and response shapes. It compensated with robust parsers and comments, but exact schemas would reduce guesswork.
- Security is contextual: The AI highlighted auth weaknesses (stubbed `signIn`, no session verification, CSRF considerations), but hardening requires concrete backend and deployment details. Some advice stays theoretical until wired to real infra.
- Ambiguity in conventions: When naming endpoints (`/Poll` vs `/polls`) or choosing cache modes, the AI made reasonable calls, yet alignment with team conventions demands human confirmation. The assistant can propose patterns but not enforce org standards.

What I learned about prompting
- Be explicit about endpoints, shapes, and edge cases. The clearer the contract, the better the generated code. When exact schemas weren’t available, asking for defensive parsing and graceful fallbacks led to more resilient helpers.
- Ask for validation and error strategies. Prompting for typed parsers, null behavior, and error messages upfront avoids back-and-forth later.
- Request examples and usage notes. Small snippets in the README made integration straightforward and served as quick tests of the APIs.

What I learned about reviewing
- Verify assumptions early. When the AI proposes endpoint paths or response shapes, confirm them against the backend (or document the assumptions). This prevents drift.
- Read with an eye for edge cases. The AI is strong on the happy path; nudging it to cover 404s, non-OK statuses, and variant shapes yields production-friendlier code.
- Keep security in view. The AI can surface common risks (token storage, CSRF, enumeration), but the team must decide on the precise mitigation based on architecture.

What I learned about iterating
- Iterate in small, typed steps. Each helper or utility was added with types, parsing, and tests-by-example in docs. This minimized refactor pain.
- Standardize patterns. Consistent headers, error messages, and parsing utilities kept the codebase coherent as features grew.
- Close the loop with documentation. Updating the README alongside code ensured the mental model stayed aligned and lowered onboarding friction.

Overall, AI accelerated the build and nudged good practices—types, validation, and documentation. The most value came when prompts were concrete and when I reviewed with a systems mindset: confirm assumptions, think about failure modes, and connect code to real-world constraints like security and deployment.


