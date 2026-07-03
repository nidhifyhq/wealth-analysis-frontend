# OneSignal Push Notification API

## Base URL

```
http://localhost:5000/api/notifications
```

All endpoints require `Authorization: Bearer <token>` header.

---

## 0. Get Users List (for dropdown)

```bash
curl -X GET http://localhost:5000/api/notifications/users \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true,
  "users": [
    { "userId": 1, "name": "John Doe" },
    { "userId": 2, "name": "Jane Smith" }
  ]
}
```

Use the `userId` values in the `userIds` array of the send endpoint.

---

## 1. Send Custom Notification

Clicking the notification opens the provided `url`.  
If `url` is omitted, it defaults to `https://wealth.nidhify.com`.

### 1.1 Send to All Users

```bash
curl -X POST http://localhost:5000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Hello Everyone",
    "message": "This is a test notification to all users",
    "sendToAll": true,
    "url": "https://wealth.nidhify.com/dashboard"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Notification sent successfully",
  "totalUserReceived": 150
}
```

---

### 1.2 Send to Specific Users

```bash
curl -X POST http://localhost:5000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Personal Offer",
    "message": "This offer is just for you!",
    "userIds": [1, 2, 5],
    "url": "https://wealth.nidhify.com/dashboard"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Notification sent successfully",
  "totalUserReceived": 3
}
```

---

### 1.3 Without URL (uses default)

```bash
curl -X POST http://localhost:5000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Hello Everyone",
    "message": "This is a test notification to all users",
    "sendToAll": true
  }'
```

The `url` field defaults to **`https://wealth.nidhify.com`** when omitted.

**Response:**

```json
{
  "success": true,
  "message": "Notification sent successfully",
  "totalUserReceived": 150
}
```

---

## 2. Send Random Notification

Picks a random notification from the list (with its predefined `url`) and sends to all users.

### 2.1 Random from All (morning or evening)

```bash
curl -X POST http://localhost:5000/api/notifications/send-random \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{}'
```

**Response:**

```json
{
  "success": true,
  "sent": {
    "title": "📈 Investment Idea",
    "body": "See today's top investment opportunity.",
    "scheduleAt": "evening",
    "url": "https://wealth.nidhify.com/dashboard"
  },
  "totalUserReceived": 150
}
```

---

### 2.2 Random Morning Notification

```bash
curl -X POST http://localhost:5000/api/notifications/send-random \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "scheduleAt": "morning"
  }'
```

**Response:**

```json
{
  "success": true,
  "sent": {
    "title": "📊 Got a new CAS Statement?",
    "body": "Got your latest Consolidated Account Statement? Upload it now to instantly update your entire MF portfolio!",
    "scheduleAt": "morning",
    "url": "https://wealth.nidhify.com/mf"
  },
  "totalUserReceived": 150
}
```

---

### 2.3 Random Evening Notification

```bash
curl -X POST http://localhost:5000/api/notifications/send-random \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "scheduleAt": "evening"
  }'
```

**Response:**

```json
{
  "success": true,
  "sent": {
    "title": "🛎️ Post-Market Check-in",
    "body": "The markets have wrapped up! Tap to see how your current value metrics look on the dashboard.",
    "scheduleAt": "evening",
    "url": "https://wealth.nidhify.com/dashboard"
  },
  "totalUserReceived": 150
}
```
