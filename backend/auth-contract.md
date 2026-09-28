# HER Authentication Boundary

- The mobile app sends an authenticated session access token.
- The server verifies the token before reading or writing user data.
- The server derives the authenticated user ID from the verified session.
- No endpoint trusts a client-supplied user ID.
- Service-role and database credentials remain server-only.
- Production must support logout, account deletion, and data export.

The schema is compatible with Supabase Auth because profiles are linked to auth.users.
