# Register & Login API - Curl Examples

**Base URL:** `http://localhost:5000`

---

## 1. Check Email

### Case A: Email exists and is verified
```bash
curl -X POST http://localhost:5000/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email":"verifieduser@example.com"}'
```
**Response (200):**
```json
{
  "success": true,
  "isExist": true,
  "Name": "Adarsgh"
}
```

### Case B: Email does not exist
```bash
curl -X POST http://localhost:5000/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com"}'
```
**Response (200):**
```json
{
  "success": true,
  "isExist": false
}
```

### Case C: Email exists but is NOT verified (registered but never verified OTP)
```bash
curl -X POST http://localhost:5000/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email":"unverified@example.com"}'
```
**Response (200):**
```json
{
  "success": true,
  "isExist": false
}
```
> User is redirected to Register page — can re-register with same email.

---

## 2. Register - Send OTP

### Success: New user
```bash
curl -X POST http://localhost:5000/api/auth/register-send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "mobile":"9876543210",
    "email":"john.doe@example.com",
    "password":"MyPass@123",
    "isRegisterConsent":true
  }'
```
**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

### Success: Re-register (unverified user trying again with same email)
```bash
curl -X POST http://localhost:5000/api/auth/register-send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Updated",
    "mobile":"9123456789",
    "email":"unverified@example.com",
    "password":"NewPass@456",
    "isRegisterConsent":true
  }'
```
**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```
> Existing unverified record is overwritten with new details and new OTP sent.

### Error: Missing required fields
```bash
curl -X POST http://localhost:5000/api/auth/register-send-otp \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```
**Response (400):**
```json
{
  "success": false,
  "message": "Name, mobile, email, and password are required"
}
```

### Error: Invalid mobile (not 10 digits)
```bash
curl -X POST http://localhost:5000/api/auth/register-send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "mobile":"12345",
    "email":"john@example.com",
    "password":"Pass@123",
    "isRegisterConsent":true
  }'
```
**Response (400):**
```json
{
  "success": false,
  "message": "Mobile number must be exactly 10 digits"
}
```

### Error: Email already verified
```bash
curl -X POST http://localhost:5000/api/auth/register-send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "mobile":"9876543210",
    "email":"verifieduser@example.com",
    "password":"Pass@123",
    "isRegisterConsent":true
  }'
```
**Response (400):**
```json
{
  "success": false,
  "message": "Email already registered and verified"
}
```

---

## 3. Verify OTP

### Success: Correct OTP
```bash
curl -X POST http://localhost:5000/api/auth/register-verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","otp":"4821"}'
```
**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 10,
  "Name": "John Doe"
}
```

### Error: Invalid OTP
```bash
curl -X POST http://localhost:5000/api/auth/register-verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","otp":"0000"}'
```
**Response (400):**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

### Error: Expired OTP
```bash
curl -X POST http://localhost:5000/api/auth/register-verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","otp":"4821"}'
```
**Response (400):**
```json
{
  "success": false,
  "message": "OTP expired. Please request a new OTP."
}
```

### Error: User not found
```bash
curl -X POST http://localhost:5000/api/auth/register-verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com","otp":"1234"}'
```
**Response (400):**
```json
{
  "success": false,
  "message": "User not found"
}
```

### Error: Already verified
```bash
curl -X POST http://localhost:5000/api/auth/register-verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"verifieduser@example.com","otp":"1234"}'
```
**Response (400):**
```json
{
  "success": false,
  "message": "Email already verified"
}
```

---

## 4. Login

### Success: Verified user, correct credentials
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"MyPass@123"}'
```
**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 10,
  "Name": "John Doe"
}
```

### Error: Unverified user
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"unverified@example.com","password":"NewPass@456"}'
```
**Response (401):**
```json
{
  "success": false,
  "message": "Email not verified. Please register again."
}
```

### Error: Wrong password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"WrongPass"}'
```
**Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Error: Email not registered
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ghost@example.com","password":"SomePass@1"}'
```
**Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 5. Get Current User (Me) - Requires Token

### Success: Valid token
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "665a1b2c3d4e5f6a7b8c9d0e",
    "userId": 10,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "9876543210",
    "isRegisterConsent": true,
    "isVerified": true,
    "createdAt": "2026-06-26T06:00:00.000Z"
  }
}
```

### Error: No token
```bash
curl http://localhost:5000/api/auth/me
```
**Response (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Error: Invalid token
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalidtoken"
```
**Response (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```
