{
  "success": true,
  "data": {
    "summary": {
      "count": 2,
      "totalDeposited": 120000,
      "totalCurrentValue": 128456.75,
      "totalInterestEarned": 8456.75,
      "totalReturnPercent": 7.05
    },
    "items": [
      {
        "_id": "665a2c3d4e5f6a7b8c9d0e1f",
        "institutionName": "SBI",
        "monthlyDeposit": 10000,
        "interestRate": 7.2,
        "depositDayOfMonth": 10,
        "compoundingFrequency": "Quarterly",
        "startDate": "2025-01-01T00:00:00.000Z",
        "maturityDate": "2028-01-01T00:00:00.000Z",
        "tenure": "3Y 0M",
    
        "totalDeposited": 180000,
        "currentValue": 185432.50,
 
        "interestEarned": 5432.50,
        
      }
    ]
  }
}

### Get All RDs
```bash
curl http://localhost:5000/api/rd \
  -H "Authorization: Bearer <token>"
```

### Delete RD
```bash
curl -X DELETE http://localhost:5000/api/rd/<id> \
  -H "Authorization: Bearer <token>"
```

  Make RecurringDeposit page and show details in RecurringDeposit.jsx. you can take refrense from GoldDashboard.jsx Page for UI and design. in every className use RecurringDeposit as prefix