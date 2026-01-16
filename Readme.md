# CampusHub - Multi-Tenant Campus Management Platform

A modern, full-stack multi-tenant web application for managing campus clubs, events, and memberships across multiple institutions. Built with React, Node.js, Express, and MongoDB.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20MongoDB-blue)
![Node Version](https://img.shields.io/badge/Node-22.x-green)

## ✨ Features

### 🏢 Multi-Tenancy
- **Institution Management**: Each institution has its own isolated workspace
- **Unique Institution Codes**: Auto-generated 6-character codes for each institution
- **Tenant Isolation**: Complete data separation between institutions
- **Global & Tenant-Specific Routes**: Flexible routing architecture

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based auth with refresh tokens
- **HTTP-Only Cookies**: Refresh tokens stored securely
- **Role-Based Access Control**: ADMIN, MEMBER roles
- **Password Reset Flow**: Email-based password recovery
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

### 📧 Email Notifications (Resend)
- **Institution Registration**: Welcome email with institution code
- **Password Reset**: Secure reset link delivery
- **Resend Integration**: Modern email API service

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
- **Runtime**: Node.js 22.x
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email Service**: Resend
- **Security**: Helmet, express-mongo-sanitize, hpp
- **Rate Limiting**: express-rate-limit
- **Logging**: Morgan

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Styling**: Custom CSS with design system
- **Fonts**: Google Fonts (Outfit, Inter)
- **State Management**: Context API

## 🚀 Quick Start

### Prerequisites
- Node.js 22.x or higher
- MongoDB (local or hosted)
- Resend API key (for emails)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd multi-tenant
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

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM="CampusHub <onboarding@resend.dev>"

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important Notes**:
- Generate a strong `JWT_SECRET` (32+ characters)
- Get a Resend API key from https://resend.com
- For production, verify your domain in Resend and update `EMAIL_FROM`

### 4. Run the Application

#### Development Mode

**Terminal 1 - Backend**:
```bash
cd backend
npm start
# Server runs on http://localhost:5008
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
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
multi-tenant/
├── backend/
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
│   │   └── sendEmail.js            # Email service (Resend)
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   └── server.js                   # Express app entry
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
└── README.md
```

## 🔌 API Endpoints

### Global Authentication
- `POST /api/institutions/register` - Register new institution
- `POST /api/auth/login` - Global login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:token` - Reset password
- `PUT /api/auth/password` - Change password (protected)

### Tenant Authentication
- `POST /api/:institutionCode/auth/login` - Tenant login
- `POST /api/:institutionCode/auth/register` - Tenant registration

### Clubs
- `GET /api/:institutionCode/clubs` - List all clubs
- `GET /api/:institutionCode/clubs/:clubId` - Get club details
- `GET /api/:institutionCode/clubs/:clubId/members` - Get club members
- `GET /api/:institutionCode/clubs/:clubId/events` - Get club events
- `POST /api/:institutionCode/clubs/:clubId/join` - Join club (protected)

### Events
- `GET /api/:institutionCode/events` - List events (paginated)
- `POST /api/:institutionCode/events/:eventId/register` - Register for event (protected)

### Admin
- `POST /api/:institutionCode/admin/clubs` - Create club
- `POST /api/:institutionCode/admin/events` - Create event
- `GET /api/:institutionCode/admin/requests` - Get pending membership requests
- `PATCH /api/:institutionCode/admin/requests/:id` - Approve/reject membership
- `GET /api/:institutionCode/admin/users` - List users (with search/filter/sort)
- `DELETE /api/:institutionCode/admin/users/:id` - Delete user
- `PATCH /api/:institutionCode/admin/users/:id/role` - Update user role
- `GET /api/:institutionCode/admin/audit-logs` - Get audit logs

### User
- `GET /api/:institutionCode/me/memberships` - Get my memberships
- `GET /api/:institutionCode/me/event-registrations` - Get my event registrations

## 🎯 Key Features Explained

### Multi-Tenancy Architecture
Each institution operates in complete isolation:
- Separate data spaces per institution
- Institution-specific URLs (/:institutionCode/...)
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
- **Not a member**: "Join Club" button
- **Pending approval**: "Request Pending" (disabled)
- **Approved**: "View Club" button (navigates to details)
- **Rejected**: Shows rejection status

### On-Screen Messaging
All user feedback appears as styled banners:
- ✅ Success messages (green)
- ❌ Error messages (red)
- Auto-dismiss after 3-5 seconds
- No browser alert() popups

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | ❌ No | `5008` | Backend server port |
| `MONGO_URI` | ✅ Yes | - | MongoDB connection string |
| `JWT_SECRET` | ✅ Yes | - | Secret key for JWT (32+ chars) |
| `RESEND_API_KEY` | ✅ Yes | - | Resend API key for emails |
| `EMAIL_FROM` | ❌ No | `CampusHub <onboarding@resend.dev>` | Email sender address |
| `FRONTEND_URL` | ❌ No | `http://localhost:5173` | Frontend URL for CORS |
| `NODE_ENV` | ❌ No | `development` | Environment mode |

## 🚀 Deployment Guide

### Backend Deployment

**Render / Railway / Heroku**:
1. Connect your repository
2. Set environment variables
3. Deploy command: `npm start`
4. Build command: `npm install`

**VPS (DigitalOcean, AWS, etc.)**:
```bash
# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone <your-repo>
cd multi-tenant/backend
npm install
pm2 start server.js --name campushub
pm2 save
pm2 startup
```

### Frontend Deployment

**Vercel / Netlify**:
1. Connect repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend.com/api`

### Database

**MongoDB Atlas** (Recommended):
1. Create free cluster at https://mongodb.com/cloud/atlas
2. Whitelist your IP or use 0.0.0.0/0 for development
3. Get connection string and add to `MONGO_URI`

## 🔒 Production Checklist

- [ ] Set strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Configure MongoDB Atlas with proper access controls
- [ ] Set up Resend with verified domain
- [ ] Update `EMAIL_FROM` to your domain
- [ ] Enable HTTPS for both frontend and backend
- [ ] Set `FRONTEND_URL` to production URL
- [ ] Configure `VITE_API_URL` in frontend
- [ ] Set up PM2 for process management
- [ ] Configure nginx reverse proxy (if using VPS)
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Enable rate limiting in production
- [ ] Set up monitoring and logging
- [ ] Create database backups
- [ ] Test all features in production environment

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "your-connection-string"
```

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- For production, verify your domain in Resend
- Update `EMAIL_FROM` to use verified domain

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend is running and accessible
- Check browser console for errors

### Institution Code Issues
- Old database index: Run `db.institutions.dropIndex('institutionCode_1')`
- Ensure MongoDB is running
- Check for duplicate institution codes

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ for the campus community.
