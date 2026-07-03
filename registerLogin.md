Usage:
# Step 1: sync NAV (waits for completion)
curl -X POST http://localhost:5000/api/admin/sync-nav \
  -H "Authorization: Bearer <token>"

# Step 2: after step 1 returns 200, update portfolios
curl -X POST http://localhost:5000/api/admin/update-portfolios \
  -H "Authorization: Bearer <token>"
Both endpoints require a valid JWT where req.user.userId matches ADMIN_USER_ID in .env. Each endpoint blocks until complete and returns the result in the response body.
▣  Build · DeepSeek V4 Flash Free · 36.0s
also give me response with scnerios
+ Thought: 411ms
POST /api/admin/sync-nav
Scenario	Status	Response
No token	401	{ "success": false, "message": "No token provided" }
Invalid token	401	{ "success": false, "message": "Invalid token" }
Token user not admin	403	{ "success": false, "message": "Access denied" }
ADMIN_USER_ID not set	500	{ "success": false, "message": "ADMIN_USER_ID not configured" }
Success	200	{ "success": true, "data": { "updated": 1250, "failed": 3 }, "message": "NAV sync complete: 1250 updated, 3 failed" }
Server error	500	{ "success": false, "message": "..." }
POST /api/admin/update-portfolios
Scenario	Status	Response
Auth failures	401/403/500	Same as above
Success	200	{ "success": true, "data": { "totalPortfolios": 50, "updatedPortfolios": 42, "failedPortfolios": 0 }, "message": "Portfolio update complete: 50 found, 42 updated, 0 failed" }
Server 	500	{ "success": false, "message": "..." }