# Home Tuition Platform - API Documentation

**Base URL:** `http://localhost:5000/api`  
**API Version:** 1.0  
**Last Updated:** May 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [Tutors](#tutors)
3. [Bookings](#bookings)
4. [Messages](#messages)
5. [Reviews](#reviews)
6. [Users](#users)
7. [Error Handling](#error-handling)

---

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### Register (Signup)

**Endpoint:** `POST /auth/signup`

**Public:** Yes

**Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "student"
}
```

**Response (201):**
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "User created successfully"
}
```

**Errors:**
- `400`: Invalid email or password too weak
- `409`: Email already exists

---

### Login

**Endpoint:** `POST /auth/login`

**Public:** Yes

**Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "student@example.com",
  "role": "student",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "Login successful"
}
```

**Errors:**
- `401`: Invalid credentials
- `404`: User not found

---

### Refresh Token

**Endpoint:** `POST /auth/refresh`

**Public:** Yes

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "message": "Token refreshed"
}
```

**Errors:**
- `401`: Invalid or expired refresh token

---

### Logout

**Endpoint:** `POST /auth/logout`

**Protected:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Verify Email

**Endpoint:** `POST /auth/verify-email`

**Public:** Yes

**Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Public:** Yes

**Body:**
```json
{
  "email": "student@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password

**Endpoint:** `POST /auth/reset-password`

**Public:** Yes

**Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Tutors

### Get All Tutors

**Endpoint:** `GET /tutors`

**Public:** Yes

**Query Parameters:**
- `subject` (optional): Filter by subject (e.g., "Math", "English")
- `minRate` (optional): Minimum hourly rate
- `maxRate` (optional): Maximum hourly rate
- `location` (optional): Location filter
- `rating` (optional): Minimum rating (1-5)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example Request:**
```
GET /tutors?subject=Math&minRate=20&maxRate=50&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "tutors": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440002",
      "subjects": ["Math", "Physics"],
      "hourlyRate": 35.00,
      "bio": "Experienced math tutor",
      "profileImageUrl": "https://cloudinary.com/...",
      "averageRating": 4.8,
      "totalReviews": 25,
      "location": "New York",
      "createdAt": "2026-05-01T10:00:00Z",
      "updatedAt": "2026-05-01T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

---

### Get Tutor by ID

**Endpoint:** `GET /tutors/:id`

**Public:** Yes

**Example Request:**
```
GET /tutors/550e8400-e29b-41d4-a716-446655440001
```

**Response (200):**
```json
{
  "success": true,
  "tutor": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "subjects": ["Math", "Physics", "Chemistry"],
    "hourlyRate": 40.00,
    "qualifications": "B.S. in Mathematics, 5+ years experience",
    "bio": "Passionate about helping students excel",
    "profileImageUrl": "https://cloudinary.com/...",
    "averageRating": 4.8,
    "totalReviews": 25,
    "location": "New York, NY",
    "createdAt": "2026-05-01T10:00:00Z"
  },
  "reviews": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "rating": 5,
      "comment": "Excellent tutor, very knowledgeable",
      "reviewerName": "Jane Doe",
      "createdAt": "2026-05-10T14:30:00Z"
    }
  ]
}
```

---

### Create Tutor Profile

**Endpoint:** `POST /tutors`

**Protected:** Yes (Tutor role only)

**Body:**
```json
{
  "subjects": ["Math", "Physics"],
  "hourlyRate": 40,
  "qualifications": "B.S. in Mathematics",
  "bio": "Experienced tutor in STEM subjects",
  "location": "New York, NY"
}
```

**Response (201):**
```json
{
  "success": true,
  "tutor": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "subjects": ["Math", "Physics"],
    "hourlyRate": 40,
    "qualifications": "B.S. in Mathematics",
    "bio": "Experienced tutor in STEM subjects",
    "location": "New York, NY",
    "createdAt": "2026-05-12T10:00:00Z"
  },
  "message": "Tutor profile created"
}
```

---

### Update Tutor Profile

**Endpoint:** `PUT /tutors/:id`

**Protected:** Yes (Owner or Admin)

**Body:**
```json
{
  "hourlyRate": 45,
  "bio": "Updated bio",
  "subjects": ["Math", "Physics", "Chemistry"]
}
```

**Response (200):**
```json
{
  "success": true,
  "tutor": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "hourlyRate": 45,
    "bio": "Updated bio",
    "subjects": ["Math", "Physics", "Chemistry"],
    "updatedAt": "2026-05-12T11:00:00Z"
  },
  "message": "Tutor profile updated"
}
```

---

### Get Tutor Availability

**Endpoint:** `GET /tutors/:id/availability`

**Public:** Yes

**Response (200):**
```json
{
  "success": true,
  "availability": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "dayOfWeek": 0,
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "dayOfWeek": 1,
      "startTime": "10:00",
      "endTime": "16:00",
      "isAvailable": true
    }
  ]
}
```

---

### Update Tutor Availability

**Endpoint:** `PUT /tutors/:id/availability`

**Protected:** Yes (Owner)

**Body:**
```json
{
  "weeklySchedule": [
    {
      "dayOfWeek": 0,
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    },
    {
      "dayOfWeek": 1,
      "startTime": "10:00",
      "endTime": "18:00",
      "isAvailable": true
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Availability updated successfully"
}
```

---

## Bookings

### Create Booking Request

**Endpoint:** `POST /bookings`

**Protected:** Yes (Student/Parent)

**Body:**
```json
{
  "tutorId": "550e8400-e29b-41d4-a716-446655440001",
  "sessionDate": "2026-05-20",
  "startTime": "14:00",
  "duration": 60,
  "subject": "Math"
}
```

**Response (201):**
```json
{
  "success": true,
  "booking": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "studentId": "550e8400-e29b-41d4-a716-446655440011",
    "tutorId": "550e8400-e29b-41d4-a716-446655440001",
    "sessionDate": "2026-05-20",
    "startTime": "14:00",
    "durationMinutes": 60,
    "subject": "Math",
    "status": "pending",
    "createdAt": "2026-05-12T12:00:00Z"
  },
  "message": "Booking request created"
}
```

**Errors:**
- `400`: Invalid date/time or tutor unavailable
- `404`: Tutor not found
- `409`: Conflict with existing booking

---

### Get Bookings

**Endpoint:** `GET /bookings`

**Protected:** Yes

**Query Parameters:**
- `status` (optional): "pending", "confirmed", "completed", "cancelled"
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response (200):**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "studentId": "550e8400-e29b-41d4-a716-446655440011",
      "studentName": "John Doe",
      "tutorId": "550e8400-e29b-41d4-a716-446655440001",
      "tutorName": "Jane Smith",
      "sessionDate": "2026-05-20",
      "startTime": "14:00",
      "durationMinutes": 60,
      "subject": "Math",
      "status": "pending",
      "createdAt": "2026-05-12T12:00:00Z"
    }
  ],
  "total": 5,
  "page": 1
}
```

---

### Get Booking by ID

**Endpoint:** `GET /bookings/:id`

**Protected:** Yes

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "studentId": "550e8400-e29b-41d4-a716-446655440011",
    "studentName": "John Doe",
    "tutorId": "550e8400-e29b-41d4-a716-446655440001",
    "tutorName": "Jane Smith",
    "sessionDate": "2026-05-20",
    "startTime": "14:00",
    "durationMinutes": 60,
    "subject": "Math",
    "status": "pending",
    "createdAt": "2026-05-12T12:00:00Z"
  }
}
```

---

### Approve Booking

**Endpoint:** `PUT /bookings/:id/approve`

**Protected:** Yes (Tutor owner)

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "status": "confirmed",
    "updatedAt": "2026-05-12T13:00:00Z"
  },
  "message": "Booking confirmed"
}
```

---

### Reject Booking

**Endpoint:** `PUT /bookings/:id/reject`

**Protected:** Yes (Tutor owner)

**Body:**
```json
{
  "reason": "Not available at this time"
}
```

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "status": "cancelled",
    "cancellationReason": "Not available at this time",
    "updatedAt": "2026-05-12T13:05:00Z"
  },
  "message": "Booking rejected"
}
```

---

### Cancel Booking

**Endpoint:** `PUT /bookings/:id/cancel`

**Protected:** Yes (Student/Tutor owner)

**Body:**
```json
{
  "reason": "Need to reschedule"
}
```

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "status": "cancelled",
    "cancellationReason": "Need to reschedule",
    "updatedAt": "2026-05-12T13:10:00Z"
  },
  "message": "Booking cancelled"
}
```

---

### Complete Booking

**Endpoint:** `PUT /bookings/:id/complete`

**Protected:** Yes (Tutor owner)

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "status": "completed",
    "updatedAt": "2026-05-12T15:10:00Z"
  },
  "message": "Booking marked as completed"
}
```

---

## Messages

### Get Conversations

**Endpoint:** `GET /conversations`

**Protected:** Yes

**Response (200):**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "participantId": "550e8400-e29b-41d4-a716-446655440021",
      "participantName": "John Tutor",
      "lastMessageAt": "2026-05-12T10:30:00Z",
      "lastMessage": "See you tomorrow!",
      "unreadCount": 2
    }
  ]
}
```

---

### Create Conversation

**Endpoint:** `POST /conversations`

**Protected:** Yes

**Body:**
```json
{
  "participantId": "550e8400-e29b-41d4-a716-446655440021"
}
```

**Response (201):**
```json
{
  "success": true,
  "conversation": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "participantId": "550e8400-e29b-41d4-a716-446655440021",
    "createdAt": "2026-05-12T10:00:00Z"
  },
  "message": "Conversation created"
}
```

---

### Get Messages

**Endpoint:** `GET /messages/:conversationId`

**Protected:** Yes

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Messages per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "messages": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440030",
      "senderId": "550e8400-e29b-41d4-a716-446655440031",
      "senderName": "John Doe",
      "text": "Hi, I need help with Math",
      "isRead": true,
      "bookingId": null,
      "createdAt": "2026-05-12T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440032",
      "senderId": "550e8400-e29b-41d4-a716-446655440021",
      "senderName": "Jane Tutor",
      "text": "I can help you with that",
      "isRead": true,
      "bookingId": null,
      "createdAt": "2026-05-12T10:05:00Z"
    }
  ],
  "total": 2
}
```

---

### Send Message

**Endpoint:** `POST /messages`

**Protected:** Yes

**Body:**
```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440020",
  "text": "When can we schedule our session?",
  "bookingId": "550e8400-e29b-41d4-a716-446655440010"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": {
    "id": "550e8400-e29b-41d4-a716-446655440033",
    "conversationId": "550e8400-e29b-41d4-a716-446655440020",
    "senderId": "550e8400-e29b-41d4-a716-446655440011",
    "text": "When can we schedule our session?",
    "isRead": false,
    "bookingId": "550e8400-e29b-41d4-a716-446655440010",
    "createdAt": "2026-05-12T10:30:00Z"
  }
}
```

---

## Reviews

### Create Review

**Endpoint:** `POST /reviews`

**Protected:** Yes (Only after completed booking)

**Body:**
```json
{
  "tutorId": "550e8400-e29b-41d4-a716-446655440001",
  "bookingId": "550e8400-e29b-41d4-a716-446655440010",
  "rating": 5,
  "comment": "Excellent tutor! Very knowledgeable and patient."
}
```

**Response (201):**
```json
{
  "success": true,
  "review": {
    "id": "550e8400-e29b-41d4-a716-446655440040",
    "tutorId": "550e8400-e29b-41d4-a716-446655440001",
    "rating": 5,
    "comment": "Excellent tutor! Very knowledgeable and patient.",
    "reviewerName": "Jane Doe",
    "createdAt": "2026-05-12T16:00:00Z"
  },
  "message": "Review posted successfully"
}
```

**Errors:**
- `400`: Invalid rating (must be 1-5)
- `403`: Booking not completed yet
- `409`: Review already exists for this booking

---

### Get Reviews by Tutor

**Endpoint:** `GET /reviews/tutor/:tutorId`

**Public:** Yes

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Reviews per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "reviews": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440040",
      "rating": 5,
      "comment": "Excellent tutor! Very knowledgeable and patient.",
      "reviewerName": "Jane Doe",
      "createdAt": "2026-05-12T16:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440041",
      "rating": 4,
      "comment": "Good tutor, helped me understand the concepts",
      "reviewerName": "Bob Smith",
      "createdAt": "2026-05-10T14:00:00Z"
    }
  ],
  "average": 4.5,
  "total": 2
}
```

---

### Delete Review

**Endpoint:** `DELETE /reviews/:id`

**Protected:** Yes (Owner or Admin)

**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted"
}
```

---

## Users

### Get Profile

**Endpoint:** `GET /users/me`

**Protected:** Yes

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student",
    "avatarUrl": "https://cloudinary.com/...",
    "bio": "High school student",
    "verified": true,
    "createdAt": "2026-05-01T10:00:00Z"
  }
}
```

---

### Update Profile

**Endpoint:** `PUT /users/me`

**Protected:** Yes

**Body:**
```json
{
  "name": "Jane Doe",
  "bio": "Passionate learner",
  "location": "Los Angeles, CA"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "name": "Jane Doe",
    "bio": "Passionate learner",
    "location": "Los Angeles, CA",
    "updatedAt": "2026-05-12T11:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

### Get User by ID

**Endpoint:** `GET /users/:id`

**Public:** Yes (Limited public info)

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "name": "John Doe",
    "avatarUrl": "https://cloudinary.com/...",
    "role": "student"
  }
}
```

---

## Error Handling

### Standard Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

### Example Error Responses

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Tutor not found",
  "code": "TUTOR_NOT_FOUND"
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **Public endpoints**: 60 requests per minute per IP
- **Protected endpoints**: 120 requests per minute per user

---

## Testing API Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get tutors with token
curl -X GET http://localhost:5000/api/tutors \
  -H "Authorization: Bearer <your_token>"
```

### Using Postman

1. Import the API endpoints
2. Set `{{base_url}}` to `http://localhost:5000/api`
3. Store token in Postman environment variable `{{token}}`
4. Use `Authorization: Bearer {{token}}` in headers

---

**Last Updated:** May 2026  
**API Version:** 1.0
