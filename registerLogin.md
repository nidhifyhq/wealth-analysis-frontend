Step 1 — Send OTP
Request:
curl -X POST http://localhost:5000/api/auth/forgot-password-send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
Success Response (200):
{
  "success": true,
  "message": "OTP sent to email"
}
Error Responses:
{ "success": false, "message": "Email is required" }
{ "success": false, "message": "User not found with this email" }
{ "success": false, "message": "Email not verified. Please register first." }
Step 2 — Verify OTP & Reset Password
Request:
curl -X POST http://localhost:5000/api/auth/forgot-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "1234",
    "newPassword": "NewSecurePass123"
  }'
Success Response (200) — same as /api/auth/login:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 10,
  "Name": "John Doe"
}
Error Responses:
{ "success": false, "message": "Email, OTP, and new password are required" }
{ "success": false, "message": "User not found" }
{ "success": false, "message": "Invalid OTP" }
{ "success": false, "message": "OTP expired. Please request a new OTP." }

Now, in step === 'PASSWORD' below I want to give reset password in better ui when click then call /api/auth/forgot-password-send-otp with email and if status false then show error message in step === 'PASSWORD'. IF true then show four digit OTP box, NEw Password, Confirm Password and Reset Button and when clicked then getting same response as userLogin so dispatch and navigate to navigate('/dashboard');