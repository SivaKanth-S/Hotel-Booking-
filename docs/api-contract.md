# Hotel Room Booking Platform — REST API Contract

## Base URL
- Local Dev: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON Spec: `http://localhost:8080/v3/api-docs`

---

## Standard Response Schemas

### 1. Error Response (Centralized `@ControllerAdvice`)
```json
{
  "timestamp": "2026-09-11T14:35:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: Check-out date must be after check-in date",
  "path": "/api/bookings"
}
```

### 2. Authentication Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "CUSTOMER"
}
```

---

## Endpoints Specification

### 1. Authentication (Public)

#### `POST /api/auth/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123"
}
```
- **Response**: `201 Created` with Auth Response Object
- **Errors**: `400 Bad Request` (Validation errors), `409 Conflict` (Email already registered)

#### `POST /api/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password@123"
}
```
- **Response**: `200 OK` with Auth Response Object
- **Errors**: `401 Unauthorized` (Invalid credentials)

---

### 2. Hotels (Public Read / Admin Write)

#### `GET /api/hotels`
- **Auth**: Public
- **Query Parameters**:
  - `city` (string, optional)
  - `checkIn` (ISO Date `YYYY-MM-DD`, optional)
  - `checkOut` (ISO Date `YYYY-MM-DD`, optional)
  - `minPrice` (number, optional)
  - `maxPrice` (number, optional)
  - `amenities` (comma-separated string, optional, e.g., `WiFi,Pool`)
  - `minRating` (number, optional, e.g., `4.0`)
- **Response**: `200 OK`
```json
[
  {
    "id": 1,
    "name": "Grand Palace Hotel & Suites",
    "description": "Luxury 5-star oasis in the heart of downtown with skyline views and premium spa.",
    "address": "100 Central Avenue",
    "city": "New York",
    "country": "USA",
    "starRating": 4.8,
    "amenities": ["WiFi", "Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Valet Parking"],
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    ],
    "minPrice": 180.00,
    "totalRooms": 24
  }
]
```

#### `GET /api/hotels/{id}`
- **Auth**: Public
- **Response**: `200 OK` with detailed Hotel Object including room summary.
- **Errors**: `404 Not Found`

#### `POST /api/hotels`
- **Auth**: Admin (`ROLE_ADMIN`)
- **Request Body**:
```json
{
  "name": "Oceanfront Luxury Resort",
  "description": "Private beachside retreat with infinity pools and fine dining.",
  "address": "450 Ocean Drive",
  "city": "Miami",
  "country": "USA",
  "starRating": 4.9,
  "amenities": ["WiFi", "Beach Access", "Pool", "Bar", "Spa"],
  "images": ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"]
}
```
- **Response**: `201 Created`

#### `PUT /api/hotels/{id}`
- **Auth**: Admin (`ROLE_ADMIN`)
- **Response**: `200 OK`

#### `DELETE /api/hotels/{id}`
- **Auth**: Admin (`ROLE_ADMIN`)
- **Response**: `204 No Content`

---

### 3. Rooms & Availability (Public Read / Admin Write)

#### `GET /api/hotels/{hotelId}/rooms`
- **Auth**: Public
- **Response**: `200 OK` list of rooms for the given hotel.

#### `GET /api/rooms/{id}`
- **Auth**: Public
- **Response**: `200 OK` with room details.

#### `GET /api/rooms/{id}/availability`
- **Auth**: Public
- **Query Parameters**:
  - `checkIn` (ISO Date, required)
  - `checkOut` (ISO Date, required)
- **Response**: `200 OK`
```json
{
  "roomId": 10,
  "checkIn": "2026-10-01",
  "checkOut": "2026-10-04",
  "isAvailable": true,
  "unitsRemaining": 4,
  "pricePerNight": 220.00,
  "totalNights": 3,
  "estimatedTotal": 660.00
}
```

#### `POST /api/rooms`
- **Auth**: Admin (`ROLE_ADMIN`)
- **Request Body**:
```json
{
  "hotelId": 1,
  "category": "Deluxe",
  "pricePerNight": 240.00,
  "capacity": 3,
  "amenities": ["King Bed", "Ocean View Balcony", "Smart TV", "Mini Bar", "Espresso Machine"],
  "totalUnits": 8,
  "images": ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"]
}
```
- **Response**: `201 Created`

---

### 4. Bookings (Protected — JWT Required)

#### `POST /api/bookings`
- **Auth**: Customer or Admin (`ROLE_CUSTOMER`, `ROLE_ADMIN`)
- **Request Body**:
```json
{
  "roomId": 10,
  "checkInDate": "2026-10-01",
  "checkOutDate": "2026-10-04",
  "numGuests": 2,
  "promotionCode": "WELCOME10"
}
```
- **Response**: `201 Created`
```json
{
  "id": 101,
  "reservationNumber": "RES-202609-9X8K21",
  "hotelName": "Grand Palace Hotel & Suites",
  "roomCategory": "Deluxe",
  "checkInDate": "2026-10-01",
  "checkOutDate": "2026-10-04",
  "numGuests": 2,
  "totalNights": 3,
  "pricePerNight": 240.00,
  "discountAmount": 72.00,
  "totalPrice": 648.00,
  "status": "CONFIRMED",
  "createdAt": "2026-09-11T20:15:00Z"
}
```
- **Errors**:
  - `400 Bad Request` (Invalid dates, guest limit exceeded)
  - `409 Conflict` (No units available for selected dates)

#### `GET /api/bookings/me`
- **Auth**: Logged-in Customer/Admin
- **Response**: `200 OK` array of user's personal bookings.

#### `GET /api/bookings/{id}`
- **Auth**: Booking owner or Admin
- **Response**: `200 OK`

#### `PUT /api/bookings/{id}/cancel`
- **Auth**: Booking owner or Admin
- **Response**: `200 OK` with updated status `"CANCELLED"` and availability restored.

#### `GET /api/bookings` (Admin)
- **Auth**: Admin (`ROLE_ADMIN`)
- **Response**: `200 OK` list of all system bookings.

---

### 5. Promotions (Public Validate / Admin Manage)

#### `GET /api/promotions/validate?code=WELCOME10`
- **Auth**: Public / Customer
- **Response**: `200 OK` with discount details.
