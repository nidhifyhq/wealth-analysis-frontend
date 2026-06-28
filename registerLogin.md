### Create Insurance Policy

**Life Insurance**
```bash
curl -X POST http://localhost:5000/api/insurance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "insuranceType": "Life",
    "insuranceCompany": "LIC",
    "policyHolderName": "John Doe",
    "coverageAmount": 10000000,
    "startDate": "2023-04-01",
    "expiryDate": "2043-04-01"
  }'
```
**Response:**
```json
{
  "success": true
}
```

---

**Term Insurance**
```bash
curl -X POST http://localhost:5000/api/insurance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "insuranceType": "Term",
    "insuranceCompany": "HDFC Life",
    "policyHolderName": "John Doe",
    "coverageAmount": 5000000,
    "startDate": "2024-01-15"
    "expiryDate": "2026-06-01"
  }'
```
**Response:**
```json
{
  "success": true
}
```

---

**Health Insurance** (with optional `policyType`)
```bash
curl -X POST http://localhost:5000/api/insurance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "insuranceType": "Health",
    "insuranceCompany": "Star Health",
    "policyHolderName": "John Doe",
    "policyType": "Family Floater",
    "coverageAmount": 500000,
    "startDate": "2025-06-01",
    "expiryDate": "2026-06-01"
  }'
```
**Response:**
```json
{
  "success": true
}
```

---

**Motor Insurance**
```bash
curl -X POST http://localhost:5000/api/insurance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "insuranceType": "Motor",
    "insuranceCompany": "ICICI Lombard",
    "policyHolderName": "John Doe",
    "coverageAmount": 2000000,
    "startDate": "2025-03-10"
    "expiryDate": "2026-06-01"
  }'
```
**Response:**
```json
{
  "success": true
}
```

---