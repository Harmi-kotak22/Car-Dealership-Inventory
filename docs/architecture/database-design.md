# Database Design

## Authentication Domain

The authentication domain will support user registration and future login flows.

### User Entity

- `id`: string
- `name`: string
- `email`: string
- `passwordHash`: string
- `role`: string
- `createdAt`: date
- `updatedAt`: date

### Constraints

- Email must be unique.
- Passwords must never be stored in plain text.
- Role defaults to `CUSTOMER`.

### Notes

The user model should be persisted through the application repository layer and should not expose password data in API responses.
