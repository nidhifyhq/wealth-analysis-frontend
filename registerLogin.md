Here are the curl examples with all scenarios for CAS upload:
CAS Upload — POST /api/portfolio/cas-upload
Endpoint: POST http://localhost:5000/api/portfolio/cas-upload  
Auth: Bearer token required  
Content-Type: multipart/form-data  
Field: file (PDF), optional password (string)
1. Success — Upload without password (unprotected PDF)
curl -X POST http://localhost:5000/api/portfolio/cas-upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "file=@/path/to/CAS_Statement.pdf"
Response (200):
{
  "success": true,
  "data": {
    "portfolio": {
      "_id": "665a1b2c3d4e5f6a7b8c9d0e",
      "userId": "665a1b2c3d4e5f6a7b8c9d0f",
      "investorName": "Adarsh Pandey",
      "investorEmail": "adarsh@example.com",
      "statementDate": "2026-06-23T00:00:00.000Z",
      "importedAt": "2026-06-26T10:30:00.000Z",
      "holdings": [
        {
          "folioNumber": "12345678",
          "isin": "INF179K01V25",
          "schemeCode": 120716,
          "schemeName": "UTI Nifty 50 Index Fund - Growth Option - Direct",
          "amcName": "UTI Mutual Fund",
          "category": "Equity: Large Cap",
          "planType": "Direct",
          "registrar": "CAMS",
          "costValue": 50000,
          "unitBalance": 1250.456,
          "navDate": "2026-06-23T00:00:00.000Z",
          "currentNAV": 42.15,
          "marketValue": 52689.72,
          "unrealizedPnL": 2689.72,
          "unrealizedPnLPercent": 5.38,
          "rating": { ... }
        }
      ],
      "summary": {
        "totalCostValue": 50000,
        "totalMarketValue": 52689.72,
        "totalPnL": 2689.72,
        "totalPnLPercent": 5.38,
        "totalFunds": 1,
        "directFundsCount": 1,
        "regularFundsCount": 0
      }
    },
    "ratingsAttached": true
  }
}
2. Success — Password-protected PDF (correct password)
curl -X POST http://localhost:5000/api/portfolio/cas-upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "file=@/path/to/Password_Protected_CAS.pdf" \
  -F "password=MyPassword123"
Response same as above.
3. Error — No file uploaded
curl -X POST http://localhost:5000/api/portfolio/cas-upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
Response (400):
{
  "success": false,
  "message": "No file uploaded"
}
4. Error — Password required
curl -X POST http://localhost:5000/api/portfolio/cas-upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "file=@/path/to/Password_Protected_CAS.pdf"
Response (403):
{
  "success": false,
  "needsPassword": true,
  "message": "This PDF is password protected. Please provide the password."
}
5. Error — Wrong password
curl -X POST http://localhost:5000/api/portfolio/cas-upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "file=@/path/to/Password_Protected_CAS.pdf" \
  -F "password=WrongPassword"
Response (403):
{
  "success": false,
  "wrongPassword": true,
  "message": "Incorrect password. Please try again."
}
6. Error — File too large (> 10MB)
curl -X POST http://localhost:5000/api/portfolio/cas-upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "file=@/path/to/Large_File.pdf"
Response (413):
{
  "success": false,
  "message": "File too large"
}
7. Error — No auth token
curl -X POST http://localhost:5000/api/portfolio/cas-upload \
  -F "file=@/path/to/CAS_Statement.pdf"
Response (401):
{
  "success": false,
  "message": "No token provided"
}
8. Error — Invalid/malformed PDF
curl -X POST http://localhost:5000/api/portfolio/cas-upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "file=@/path/to/random_file.txt"
Response (500):
{
  "success": false,
  "message": "Failed to parse CAS PDF. Please upload a valid CAS statement."
}