# HER

HER is a private personal life app for girls and young women.

## Current foundation
- Expo + React Native + TypeScript
- HER soft pastel visual system
- Approved Home dashboard direction
- Mood check-in interaction
- Water tracking interaction
- Quick access modules
- Bottom navigation for Home, Wellness, Goals, Journal, and HER AI
- Real core module screens for cycle, money, study/career, self-care, and relationships
- Shared HER data types and seed data
- Local store layer for shared app state
- HER AI request/action contract with backend boundary
- TypeScript validation script (`npm run typecheck`)

## Run locally
npm install
npm start

## Product direction
HER is not just a period tracker. It is a private digital space for managing life: cycle, wellness, self-care, relationships, money, study/career, goals, journaling, and AI-assisted planning.

The default palette is soft and premium. Color customization will be added as a user preference.


## Backend foundation
- PostgreSQL/Supabase-compatible schema in `backend/schema.sql`
- Authenticated API boundary documented in `backend/api-contract.md`
- Security and sensitive-data rules in `backend/security.md`
- HER AI actions are validated server-side and logged
