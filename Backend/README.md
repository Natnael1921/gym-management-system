# Gym Management System – Backend API

## Base URL
https://gym-management-system-r7oa.onrender.com



## Auth Routes

POST : /api/auth/login | Login user
POST : /api/auth/register | Register 



## Admin Routes
GET : /api/admin/members | Get all members
POST : /api/admin/members | Add member
PUT : /api/admin/members/:id | Edit member
GET : /api/admin/trainers | Get trainers
POST : /api/admin/trainers | Add trainer
PUT : /api/admin/trainers/:id | Edit trainer
GET : /api/admin/attendance/week | Weekly attendance



## Trainer Routes
GET : /api/trainer/dashboard | Trainer dashboard data
GET : /api/trainer/trainees | Trainer members
GET : /api/trainer/requests | Trainer requests
POST : /api/trainer/requests/:id/approve | Approve request
POST : /api/trainer/requests/:id/reject | Reject request
GET : /api/trainer/attendance | Trainer attendance



## Member Routes
GET : /api/member/dashboard | Member dashboard
GET : /api/member/trainers | List trainers
POST : /api/member/request-trainer | Request trainer
GET : /api/member/schedule | View schedule
PUT : /api/member/schedule | Update schedule
GET : /api/member/attendance | Attendance
PATCH : /api/member/profile | Update height & weight


## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
