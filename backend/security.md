# HER Security Rules

- Every user-owned table is scoped to the authenticated user.
- Clients never choose another user's ID.
- AI receives minimum necessary context.
- Cycle, wellness, journal, and medication-related information is sensitive.
- AI write permissions are separate from normal app access.
- Every AI action is schema-validated and logged.
- Database credentials remain server-side.
- Predictions are stored separately from confirmed cycle records.
- Journal content is excluded from unrelated AI requests.
- Money data is only provided when relevant and permitted.
- Data export and deletion are required before production launch.