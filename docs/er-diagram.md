# Database Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ BOOKING : "places"
    HOTEL ||--o{ ROOM : "offers"
    ROOM ||--o{ ROOM_AVAILABILITY : "tracks daily inventory"
    ROOM ||--o{ BOOKING : "reserved in"
    PROMOTION ||--o{ BOOKING : "applies discount to"

    USERS {
        bigint id PK
        varchar(100) name
        varchar(150) email UK
        varchar(255) password_hash
        varchar(20) role "CUSTOMER | ADMIN"
        timestamp created_at
    }

    HOTEL {
        bigint id PK
        varchar(200) name
        text description
        varchar(255) address
        varchar(100) city
        varchar(100) country
        decimal star_rating
        text amenities "JSON Array / Delimited"
        text images "JSON Array / Delimited"
        timestamp created_at
    }

    ROOM {
        bigint id PK
        bigint hotel_id FK
        varchar(50) category "Standard | Deluxe | Suite | Executive"
        decimal price_per_night
        int capacity
        text amenities "JSON Array / Delimited"
        int total_units
        text images "JSON Array / Delimited"
        timestamp created_at
    }

    ROOM_AVAILABILITY {
        bigint id PK
        bigint room_id FK
        date date
        int units_available
    }

    BOOKING {
        bigint id PK
        varchar(50) reservation_number UK
        bigint user_id FK
        bigint room_id FK
        date check_in_date
        date check_out_date
        int num_guests
        decimal total_price
        varchar(30) status "PENDING | CONFIRMED | CANCELLED"
        bigint promotion_id FK
        timestamp created_at
    }

    PROMOTION {
        bigint id PK
        varchar(50) code UK
        varchar(20) discount_type "PERCENTAGE | FLAT"
        decimal discount_value
        date valid_from
        date valid_to
        boolean active
    }
```

## Entity Constraints & Invariants

1. **User Table**:
   - `email` is indexed and unique.
   - `password_hash` stores BCrypt hashes (never raw plaintext).
   - `role` defaults to `CUSTOMER`.

2. **Hotel Table**:
   - `city` is indexed for fast location-based search.
   - `star_rating` ranges between `1.0` and `5.0`.

3. **Room & Availability**:
   - `hotel_id` foreign key references `HOTEL(id)` with cascade deletion protection.
   - `total_units` defines baseline physical capacity.
   - `ROOM_AVAILABILITY` maintains available units per date. If missing, units available defaults to `room.total_units`.
   - Date range bookings decrement availability atomically.

4. **Booking**:
   - `reservation_number` is auto-generated with unique alphanumeric format (e.g., `RES-202609-AB12C3`).
   - `status` transitions: `PENDING` -> `CONFIRMED` -> `CANCELLED`.
   - Cancellation restores available units to the respective dates.
