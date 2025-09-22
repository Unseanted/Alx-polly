ALX Polly is a lightweight polling app built with Next.js (App Router) that lets users create polls, vote, and view results. The project includes a small client library for interacting with a backend API.

## Features

- Poll listing with pagination via `/polls?skip=0&limit=10`
- Fetch a specific poll by ID via `/Poll/{id}`
- Cast a vote on a poll via `/Poll/{id}/vote`
- Retrieve poll results via `/Poll/{id}/results`
- Client-side name handling with a safe fallback to "Guest"
- Minimal auth stubs and project scaffolding

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000

## Project Structure

- `app/(app)/*` — Application routes (polls list, new poll, etc.)
- `app/(auth)/*` — Auth routes (sign-in/up scaffolding)
- `lib/polls.ts` — Client-side API helpers for polls
- `lib/auth.ts` — Auth helpers and display-name utility
- `types/poll.ts` — Shared `Poll` type

## Types

```ts
export type Poll = {
  id: string;
  question: string;
  options: string[];
  createdAt: string;
};

export type PollPage = {
  items: Poll[];
  total: number;
  skip: number;
  limit: number;
};

export type PollResults = {
  id: string;
  question: string;
  options: string[];
  counts: number[];
  total: number;
  createdAt?: string;
};
```

## Client API Helpers (`lib/polls.ts`)

### Fetch a poll by ID
```ts
import { getPollById } from "@/lib/polls";

const poll = await getPollById("123"); // Poll | null (null if 404)
```

### List polls (paginated)
```ts
import { listPaginatedPolls, listPolls } from "@/lib/polls";

const page = await listPaginatedPolls(0, 10); // { items, total, skip, limit }
const items = await listPolls(0, 10); // Poll[] convenience
```

### Cast a vote
```ts
import { castVote } from "@/lib/polls";

const updated = await castVote("abc123", 1); // returns updated Poll
```

### Get poll results
```ts
import { getPollResults } from "@/lib/polls";

const results = await getPollResults("abc123"); // { id, question, options, counts, total }
```

### Response Parsing & Errors

- All helpers validate response shapes and throw if invalid
- `getPollById` returns `null` for 404s
- Other helpers throw for non-OK responses

## Auth Utilities (`lib/auth.ts`)

### Display name fallback
```ts
import { getDisplayName } from "@/lib/auth";

getDisplayName(undefined); // "Guest"
getDisplayName("   ");   // "Guest"
getDisplayName("Alice"); // "Alice"
```

Where it’s used: intended for header/nav, greetings, or any UI that needs a readable label even when the profile name is missing. This avoids empty or "undefined" labels and keeps the UX consistent.

## Example: Register via Python (requests)

While the Next.js app doesn’t include a Python runtime, you can register users against the backend with the following example (adapt payload fields to your OpenAPI spec):

```python
import requests
from typing import Any, Dict, Optional


class RegistrationError(Exception):
    pass


def register_user(
    base_url: str,
    payload: Dict[str, Any],
    *,
    timeout: float = 10.0,
    headers: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    url = base_url.rstrip("/") + "/register"
    req_headers: Dict[str, str] = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        **(headers or {}),
    }

    resp = requests.post(url, json=payload, headers=req_headers, timeout=timeout)

    if resp.status_code in (200, 201):
        try:
            return resp.json()
        except ValueError as exc:
            raise RegistrationError("Invalid JSON response from /register") from exc

    if resp.status_code == 400:
        raise RegistrationError(f"Validation error: {resp.text}")
    if resp.status_code == 409:
        raise RegistrationError(f"Conflict: {resp.text}")

    raise RegistrationError(f"Registration failed: {resp.status_code} {resp.text}")
```

## Development

```bash
npm run dev      # start dev server
npm run build    # build
npm run start    # start production server
npm run lint     # biome check
npm run format   # biome format --write
```

## Notes

- Ensure your frontend is configured to talk to the correct API base (e.g., through a reverse proxy or environment config). The examples use relative paths like `/Poll/{id}` and `/polls`.
- MCP configuration is available at `.cursor/mcp.json` and has been validated for correct JSON syntax.

---

ALX Polly – simple polls, clean API helpers, and solid UX defaults.
