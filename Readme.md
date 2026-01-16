# CampusHub - Multi-Tenant Campus Management Platform

A modern, full-stack multi-tenant web application for managing campus clubs, events, and memberships across multiple institutions. Built with React, Node.js, Express, and MongoDB.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20MongoDB-blue)
![Node Version](https://img.shields.io/badge/Node-18.x+-green)

## 🔗 Demo

[Live Demo](#) <!-- Add your deployed link here -->

## ✨ Features

### 🏢 Multi-Tenancy
- **Institution Management**: Each institution has its own isolated workspace
- **Unique Institution Codes**: Auto-generated 6-character codes for each institution
- **Tenant Isolation**: Complete data separation between institutions
- **Global & Tenant-Specific Routes**: Flexible routing architecture

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based auth with refresh tokens
- **HTTP-Only Cookies**: Refresh tokens stored securely
- **Role-Based Access Control**: SUPER_ADMIN, ADMIN, MEMBER roles
- **Password Reset Flow**: Email-based password recovery with SendGrid
- **Protected Routes**: Frontend and backend route protection
- **Audit Logging**: Track all admin actions

### 👥 Club Management
- **Create & Browse Clubs**: Rich club profiles with categories
- **Membership Workflow**: Request → Pending → Approved/Rejected
- **Club Details Page**: View members, events, and club information
- **Smart Membership UI**: Dynamic buttons based on membership status
- **Admin Approval System**: Manage membership requests

### 📅 Event Management
- **Event Creation**: With comprehensive validation
- **Past Date Prevention**: Cannot create events in the past
- **Conflict Detection**: No overlapping events for same club or institution
- **Event Registration**: Users can register for events
- **Pagination**: Browse events with pagination controls
- **Capacity Management**: Track available spots

### 📧 Email Notifications (SendGrid)
- **Institution Registration**: Welcome email with institution code
- **Password Reset**: Secure reset link delivery
- **SendGrid Integration**: Reliable email delivery service

### 🎨 Premium UI/UX
- **Modern Design System**: CSS variables, glassmorphism, gradients
- **Responsive Layout**: Mobile-first design
- **Smooth Animations**: CSS transitions and keyframes
- **On-Screen Messages**: No popups - all feedback shown inline
- **Empty States**: Graceful handling of no data
- **Premium Aesthetics**: Vibrant colors, dark modes, micro-animations

### 🛡️ Admin Features
- **Institution Page**: View all users with search, filter, and sort
- **User Management**: Update roles, delete users
- **Club & Event Creation**: Full CRUD operations
- **Membership Approval**: Approve/reject membership requests
- **Audit Logs**: Track all administrative actions
- **Dashboard**: Comprehensive admin overview

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x+ | Runtime |
| Express.js | 4.22.1 | Web Framework |
| MongoDB | - | Database |
| Mongoose | 8.20.1 | ODM |
| JWT | 9.0.2 | Authentication |
| bcryptjs | 3.0.3 | Password Hashing |
| SendGrid | 8.1.6 | Email Service |
| Helmet | 8.1.0 | Security Headers |
| Morgan | 1.10.1 | Logging |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 5.1.4 | Build Tool |
| React Router | 6.22.1 | Client Routing |
| Axios | 1.6.7 | HTTP Client |
| CSS | Custom | Styling |

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB (local or hosted)
- SendGrid API key (for emails)

### 1. Clone the Repository

```bash
git clone https://github.com/White-Devil2839/clubs_help.git
cd clubs_help
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the **backend** directory:

```env
# Server Configuration
PORT=5008
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/multi-tenant-clubs

# JWT Secret (use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM="CampusHub <your-verified-email@domain.com>"

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Run the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5008
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 5. Create First Institution

1. Navigate to http://localhost:5173
2. Click "Register Institution"
3. Fill in institution details
4. You'll receive an email with your institution code
5. Login as admin to access the admin dashboard

## 📁 Project Structure

```
clubs_help/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js      # Admin operations
│   │   ├── authController.js       # Authentication & registration
│   │   ├── clubController.js       # Club management
│   │   └── eventController.js      # Event management
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification & RBAC
│   │   ├── errorMiddleware.js      # Error handling
│   │   └── institutionMiddleware.js # Tenant context
│   ├── models/
│   │   ├── AuditLog.js             # Audit logging
│   │   ├── Club.js                 # Club schema
│   │   ├── ClubMembership.js       # Membership schema
│   │   ├── Event.js                # Event schema
│   │   ├── EventRegistration.js    # Registration schema
│   │   ├── Institution.js          # Institution schema
│   │   └── User.js                 # User schema
│   ├── routes/
│   │   ├── adminRoutes.js          # Admin endpoints
│   │   ├── authRoutes.js           # Global auth routes
│   │   ├── tenantAuthRoutes.js     # Tenant-specific auth
│   │   ├── clubRoutes.js           # Club endpoints
│   │   ├── eventRoutes.js          # Event endpoints
│   │   └── userRoutes.js           # User endpoints
│   ├── utils/
│   │   ├── auditLogger.js          # Audit logging utility
│   │   ├── cronJobs.js             # Scheduled tasks
│   │   ├── jwt.js                  # JWT utilities
│   │   └── sendEmail.js            # SendGrid email service
│   ├── server.js                   # Express app entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx          # Reusable button
│   │   │   ├── Card.jsx            # Card component
│   │   │   ├── Layout.jsx          # App layout
│   │   │   ├── Navbar.jsx          # Navigation
│   │   │   └── ProtectedRoute.jsx  # Route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Admin panel
│   │   │   ├── ClubDetails.jsx     # Club detail view
│   │   │   ├── Clubs.jsx           # Clubs list
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   ├── Events.jsx          # Events list
│   │   │   ├── ForgotPassword.jsx  # Password reset request
│   │   │   ├── GlobalLogin.jsx     # Global login
│   │   │   ├── GlobalRegister.jsx  # Global registration
│   │   │   ├── Institution.jsx     # Institution management
│   │   │   ├── InstitutionSignup.jsx # Register institution
│   │   │   ├── Landing.jsx         # Landing page
│   │   │   ├── Login.jsx           # Tenant login
│   │   │   ├── Profile.jsx         # User profile
│   │   │   ├── Register.jsx        # Tenant registration
│   │   │   └── ResetPassword.jsx   # Password reset
│   │   ├── styles/
│   │   │   ├── global.css          # Global styles & variables
│   │   │   ├── components.css      # Component styles
│   │   │   ├── auth.css            # Auth page styles
│   │   │   ├── dashboard.css       # Dashboard styles
│   │   │   ├── admin.css           # Admin styles
│   │   │   ├── layout.css          # Layout styles
│   │   │   └── landing.css         # Landing page styles
│   │   ├── utils/
│   │   │   └── api.js              # Axios instance
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # Entry point
│   └── package.json
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Global Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/institutions/register` | Register new institution |
| POST | `/api/auth/login` | Global login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/forgotpassword` | Request password reset |
| PUT | `/api/auth/resetpassword/:token` | Reset password |
| PUT | `/api/auth/password` | Change password (protected) |

### Tenant Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/:institutionCode/auth/login` | Tenant login |
| POST | `/api/:institutionCode/auth/register` | Tenant registration |

### Clubs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/:institutionCode/clubs` | List all clubs |
| GET | `/api/:institutionCode/clubs/:clubId` | Get club details |
| GET | `/api/:institutionCode/clubs/:clubId/members` | Get club members |
| GET | `/api/:institutionCode/clubs/:clubId/events` | Get club events |
| POST | `/api/:institutionCode/clubs/:clubId/join` | Join club (protected) |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/:institutionCode/events` | List events (paginated) |
| POST | `/api/:institutionCode/events/:eventId/register` | Register for event |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/:institutionCode/admin/clubs` | Create club |
| POST | `/api/:institutionCode/admin/events` | Create event |
| GET | `/api/:institutionCode/admin/requests` | Get pending requests |
| PATCH | `/api/:institutionCode/admin/requests/:id` | Approve/reject membership |
| GET | `/api/:institutionCode/admin/users` | List users |
| DELETE | `/api/:institutionCode/admin/users/:id` | Delete user |
| PATCH | `/api/:institutionCode/admin/users/:id/role` | Update user role |
| GET | `/api/:institutionCode/admin/audit-logs` | Get audit logs |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/:institutionCode/me/memberships` | Get my memberships |
| GET | `/api/:institutionCode/me/event-registrations` | Get my event registrations |

## 🎯 Key Features Explained

### Multi-Tenancy Architecture
Each institution operates in complete isolation:
- Separate data spaces per institution
- Institution-specific URLs (`/:institutionCode/...`)
- Middleware enforces tenant boundaries
- No cross-institution data access

### Event Validation
Comprehensive event creation rules:
- ✅ Cannot create events in the past
- ✅ No overlapping events for the same club
- ✅ No institution-wide time conflicts
- ✅ End time must be after start time

### Membership Workflow
Smart UI adapts to membership status:
| Status | Button | Action |
|--------|--------|--------|
| Not a member | "Join Club" | Sends join request |
| Pending | "Request Pending" | Disabled |
| Approved | "View Club" | Navigate to details |
| Rejected | Shows status | N/A |

### On-Screen Messaging
All user feedback appears as styled banners:
- ✅ Success messages (green)
- ❌ Error messages (red)
- Auto-dismiss after 3-5 seconds
- No browser `alert()` popups

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Backend server port |
| `MONGO_URI` | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT (32+ chars) |
| `SENDGRID_API_KEY` | **Yes** | - | SendGrid API key for emails |
| `EMAIL_FROM` | No | - | Email sender address |
| `FRONTEND_URL` | No | `http://localhost:5173` | Frontend URL for CORS |
| `NODE_ENV` | No | `development` | Environment mode |

## 🚀 Deployment Guide

### Backend Deployment (Render / Railway)
1. Connect your repository
2. Set environment variables
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend Deployment (Vercel / Netlify)
1. Connect repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend.com/api`

### Database (MongoDB Atlas)
1. Create free cluster at [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Whitelist your IP or use `0.0.0.0/0`
3. Get connection string and add to `MONGO_URI`

## 🔒 Production Checklist

- [ ] Set strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Configure MongoDB Atlas with proper access controls
- [ ] Set up SendGrid with verified sender
- [ ] Update `EMAIL_FROM` to verified email
- [ ] Enable HTTPS for both frontend and backend
- [ ] Set `FRONTEND_URL` to production URL
- [ ] Configure `VITE_API_URL` in frontend
- [ ] Enable rate limiting in production
- [ ] Set up monitoring and logging
- [ ] Create database backups

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "your-connection-string"
```

### Email Not Sending
- Verify `SENDGRID_API_KEY` is correct
- Check SendGrid dashboard for errors
- Verify sender email in SendGrid
- Check spam folder

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend is running and accessible
- Check browser console for errors

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for the campus community.
