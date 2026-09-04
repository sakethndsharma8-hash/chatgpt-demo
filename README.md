# Setter Studio — WhatsApp-style demo simulator

An internal, independently branded sales-demo tool. It persists demo configuration and simulated conversations, but sends no real WhatsApp messages, creates no calendar events, and does not call an LLM in this milestone.

## Setup

1. Copy `.env.example` to `.env.local` and fill in your Supabase Postgres connection values, Supabase URL/anon key, site URL, and your `OPERATOR_EMAIL`.
2. In Supabase Auth, enable email magic links and add `http://localhost:3000/auth/callback` (plus the deployed equivalent) to redirect URLs.
3. Run `npm install`, then `npx prisma migrate dev --name init` and `npm run dev`.

The private dashboard is at `/dashboard`; a demo can be shared from its detail page. A shared link starts with `/demo/` and is safe to revoke by archiving the demo directly in the database until the later management module adds an archive control. `components.json` is included so future shadcn/ui primitives use the same Tailwind aliases and styling setup.

## Current boundary

The visual preview uses `lib/preview-replies.ts`, which is deterministic and local. Module 3 replaces only that seam with the Gemini-backed `generateSimulatedReply()` provider. Booking and pipeline metrics are intentionally not implemented yet.
