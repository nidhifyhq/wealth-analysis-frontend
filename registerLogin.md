### Get FD By ID
```bash
curl http://localhost:5000/api/fd/<id> \
  -H "Authorization: Bearer <token>"
```

response:

{
    "success": true,
    "data": {
        "_id": "6a3f6fca87083e721a2cf92f",
        "institutionName": "State Bank Of India",
        "principal": 100000,
        "interestRate": 7.5,
        "fdType": "Cumulative",
        "compoundingFrequency": "Quarterly",
        "startDate": "2025-01-15T00:00:00.000Z",
        "maturityDate": "2026-01-15T00:00:00.000Z",
        "tenure": "1Y 0M 0D",
        "currentValue": 111347.53,
        "maturityValue": 107708.11,
        "interestEarned": 11347.53,
        "returnPercent": 11.35,
        "planStatus: "Active"
        "createdAt": "2026-06-27T06:38:02.429Z",
    }
}



```bash
curl -X DELETE http://localhost:5000/api/fd/<id> \
  -H "Authorization: Bearer <token>"
```
**Response:**
```json
{
  "success": true,
  "message": "FD deleted successfully"
}

Now, create Folder FDDetails in FixedDeposit Folder and create FDDetails.jsx and FDDetails.module.css and in every className add FDDetails as prefix.

Create beautifull modal with better UI and UX design and show these Details beautifully. Also in bottom give Button Remove FD