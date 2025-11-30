# ClubsHub - Campus Clubs & Events Management Platform

A modern, full-stack web application for managing campus clubs, memberships, and events. Built with React, Express, and Prisma.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20Prisma%20%7C%20MySQL-blue)
![Node Version](https://img.shields.io/badge/Node-22.x-green)

## ✨ Features

- **User Authentication**: JWT-based authentication with role-based access (MEMBER/ADMIN)
- **Club Management**: Create, browse, and manage clubs with categories
- **Membership System**: Request, approve, or reject memberships with email notifications
- **Event Management**: Create events (future dates only), register users, track registrations
- **Automated Cleanup**: Background service automatically deletes expired events
- **Modern UI**: Beautiful, animated interface with responsive design

## 🛠️ Tech Stack

**Backend**: Node.js 22, Express, Prisma 6, MySQL, JWT, bcryptjs, Nodemailer  
**Frontend**: React 19, Vite 7, React Router DOM 7

## 🚀 Quick Start (Deployment)

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Required
DATABASE_URL="your-hosted-mysql-connection-string"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
PORT=5050

# Optional - CORS (set your frontend URL in production)
FRONTEND_URL=https://your-frontend-domain.com

# Optional - Email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional - Event cleanup interval (default: 5 minutes)
EVENT_CLEANUP_INTERVAL_MINUTES=5
```

### 3. Database Setup

```bash
# Generate Prisma Client
cd backend
npx prisma generate --schema ../prisma/schema.prisma

# Push schema to your hosted database
npx prisma db push --schema ../prisma/schema.prisma
```

### 4. Build & Deploy

#### Backend Deployment

```bash
cd backend
npm install --production
npx prisma generate --schema ../prisma/schema.prisma

# Start with PM2 (recommended)
pm2 start src/server.js --name clubshub-backend

# Or with Node directly
node src/server.js
```

#### Frontend Deployment

```bash
cd frontend
npm run build

# The dist/ folder contains your production build
# Serve it with nginx, Apache, or your hosting provider
```

**Frontend Configuration**: 

Option 1 - Environment Variable (Recommended):
Create a `.env.production` file in `frontend/`:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

Option 2 - Web Server Proxy:
Configure your web server (nginx/Apache) to proxy `/api/*` requests to your backend server.

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | Your hosted MySQL connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT tokens (use a strong random string) |
| `PORT` | ❌ No | Backend port (default: 5050) |
| `FRONTEND_URL` | ❌ No | Frontend URL for CORS (default: allows all) |
| `EMAIL_HOST` | ❌ No | SMTP server for email notifications |
| `EMAIL_PORT` | ❌ No | SMTP port (default: 587) |
| `EMAIL_USER` | ❌ No | Email address for sending notifications |
| `EMAIL_PASS` | ❌ No | Email password or app password |
| `EVENT_CLEANUP_INTERVAL_MINUTES` | ❌ No | How often to delete expired events (default: 5) |

## 🔐 Creating the First Admin User

After deployment, create your first admin user via database:

```bash
cd backend
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();(async()=>{await p.user.update({where:{email:'your-email@example.com'},data:{role:'ADMIN'}});console.log('User promoted to admin');process.exit(0)})()"
```

Replace `your-email@example.com` with the email you registered with.

Alternatively, if you have database access, run:
```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 📁 Project Structure

```
clubs_help/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── middlewares/     # Authentication middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities (email, cleanup, etc.)
│   │   └── server.js        # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── styles/          # Global CSS
│   │   └── App.jsx
│   └── package.json
├── prisma/
│   └── schema.prisma        # Database schema
└── .env                     # Environment variables
```

## 🔌 Key API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/clubs` - List all clubs
- `POST /api/clubs` - Create club (ADMIN)
- `POST /api/events/:id/register` - Register for event
- `POST /api/admin/event` - Create event (ADMIN, validates future date)
- `GET /api/admin/users` - List users (ADMIN)
- `PATCH /api/admin/users/:id/promote` - Promote to admin (ADMIN)

## 🎯 Important Features

### Event Date Validation
- Events can only be created with future dates/times
- Expired events are automatically deleted every 5 minutes

### Automated Cleanup
- Background service runs automatically on server start
- Deletes events that have passed and their registrations
- Configurable interval via `EVENT_CLEANUP_INTERVAL_MINUTES`

## 🚀 Deployment Platforms

### Backend (VPS/Cloud)
- Use PM2 for process management: `pm2 start src/server.js`
- Configure reverse proxy (nginx) if needed
- Set up SSL certificates for HTTPS

### Frontend (Static Hosting)
- Build: `npm run build` in `frontend/`
- Deploy `dist/` folder to:
  - Vercel
  - Netlify
  - AWS S3 + CloudFront
  - Any static hosting service

### Database
- Your hosted MySQL database (already configured via `DATABASE_URL`)

## 🔒 Production Checklist

- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Use HTTPS for both frontend and backend
- [ ] Set `FRONTEND_URL` environment variable for CORS
- [ ] Set `VITE_API_URL` in frontend `.env.production` or configure web server proxy
- [ ] Set up email service for notifications (optional)
- [ ] Configure all environment variables on your hosting platform
- [ ] Set up process manager (PM2) for backend
- [ ] Test database connection
- [ ] Create first admin user

