# HER API Contract

Authentication: every request is authenticated; the server derives user_id from the verified session.

GET /api/dashboard returns profile, today's mood, water count, active goals, due tasks, next routine, and an appropriate cycle summary.

POST /api/her-ai accepts a message and optional conversation_id. The server verifies the session, loads AI permissions, fetches minimal relevant context, calls the model, validates returned actions, executes approved actions transactionally, logs the action, and returns the result.

The model never receives database credentials and never chooses a trusted user ID.