# Ideation

## Problem Statement
Student clubs and events often lack a simple platform for discovery, membership management, and event registrations. Existing solutions are fragmented, manual (forms/spreadsheets), or require heavy setup.

## Proposed Solution
Build a streamlined portal where:
- Students can browse approved clubs, view details, request membership, and register for events.
- Admins manage clubs (approve requests), membership approvals, and events.
- Role-based access ensures members cannot perform admin actions.

Key features:
- Authentication with JWT
- Role-based permissions (MEMBER, ADMIN)
- Clubs: listing, details, membership requests/approvals
- Events: listing, registration, admin creation
- Admin reports: users, memberships, event registrations
- “My Activity” view for users to see memberships and upcoming events

Tech Stack
- Frontend: Vite + React, React Router, native fetch
- Backend: Node.js + Express, Prisma ORM
- Database: MySQL
- Security: JWT, bcrypt password hashing
- Utilities: dotenv, CORS

## Team Members & Roles
Will be updated soon



Expected Outcome
- A minimal, production-ready MVP that supports:
  - User auth and role-based access
  - Club discovery and membership flow
  - Event creation (admin), listing, and registrations
  - Admin visibility over users, memberships, and event registrations
  - A clean, extensible foundation for future features (notifications, comments, payments, etc.)
