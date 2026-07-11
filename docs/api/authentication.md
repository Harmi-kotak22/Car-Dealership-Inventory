# Authentication API Specification

## Register User

### Endpoint

POST /api/auth/register

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Validation Rules

- `name`: required, trimmed, 2-50 characters
- `email`: required, valid email, lowercase, unique
- `password`: required, minimum 8 characters, at least one uppercase, one lowercase, and one digit
- Unknown fields are rejected

### Success Response

Status: `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

### Error Responses

- `400 Bad Request`: validation failed
- `409 Conflict`: email already exists
- `500 Internal Server Error`: unexpected server error

### Acceptance Criteria

- User is saved
- Password is hashed
- Role defaults to `CUSTOMER`
- Password is never returned
- Duplicate email is rejected
- Validation works
- Unknown fields are rejected
