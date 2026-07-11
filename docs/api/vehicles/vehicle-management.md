# Vehicle Management API Specification

## Overview

This document defines the vehicle management feature for the car dealership inventory application.

## Stories

### Story 1 — Admin adds a vehicle

#### Endpoint

POST /api/vehicles

#### Request Body

```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "price": 25000,
  "category": "SEDAN",
  "quantity": 5,
  "description": "Well-maintained sedan"
}
```

#### Validation Rules

- `make`: required
- `model`: required
- `year`: required, valid year
- `price`: required, non-negative
- `category`: required
- `quantity`: required, non-negative
- Unknown fields are rejected

#### Success Response

Status: `201 Created`

```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": "...",
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "price": 25000,
    "category": "SEDAN",
    "quantity": 5,
    "description": "Well-maintained sedan"
  }
}
```

### Story 2 — Authenticated users view vehicles

#### Endpoint

GET /api/vehicles

#### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "message": "Vehicles fetched successfully",
  "data": []
}
```

### Story 3 — Authenticated users search vehicles

#### Endpoint

GET /api/vehicles/search

#### Query Parameters

- `q`: search term
- `category`: optional category filter
- `minPrice`: optional minimum price
- `maxPrice`: optional maximum price

#### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "message": "Vehicles fetched successfully",
  "data": []
}
```

### Story 4 — Admin updates a vehicle

#### Endpoint

PUT /api/vehicles/:id

#### Request Body

```json
{
  "price": 27000,
  "quantity": 3
}
```

#### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": "..."
  }
}
```

### Story 5 — Admin deletes a vehicle

#### Endpoint

DELETE /api/vehicles/:id

#### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

## Shared Rules

- Authentication is required for read/search actions.
- Only admins may create, update, or delete vehicles.
- Invalid data is rejected with `400 Bad Request`.
- Missing vehicles return `404 Not Found`.
- Unexpected errors return `500 Internal Server Error`.

## Acceptance Criteria

- Admin can create a vehicle.
- Authenticated users can view vehicles.
- Authenticated users can search vehicles.
- Admin can update a vehicle.
- Admin can delete a vehicle.
- Sensitive or invalid data is rejected.
