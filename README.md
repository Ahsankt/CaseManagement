# Case Management System

A comprehensive case management system built with React frontend and Node.js/MongoDB backend. This system allows different types of users (clients, lawyers, judges, and plaintiffs) to manage legal cases efficiently.

## Features

### User Roles & Dashboards
- **Client Dashboard**: Create new cases, track case progress, communicate with assigned lawyers
- **Lawyer Dashboard**: Manage assigned cases, communicate with clients, update case status
- **Judge Dashboard**: Oversee all cases, assign lawyers and judges, manage court proceedings
- **Plaintiff Dashboard**: Track legal proceedings, view case status, communicate with legal representation

### Core Functionality
- **Authentication & Authorization**: Role-based access control with JWT tokens
- **Case Management**: Create, update, and track cases with different statuses and priorities
- **User Management**: Registration and profile management for all user types
- **Dashboard Analytics**: Real-time statistics and case overviews
- **Document Management**: Upload and manage case-related documents
- **Case Updates**: Timeline of case progress and communications

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **date-fns** for date formatting

## Project Structure

```
CaseManagementSystem/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── caseController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Case.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cases.js
│   │   └── users.js
│   ├── utils/
│   │   └── constants.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   ├── Common/
    │   │   ├── Dashboard/
    │   │   └── Layout/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── constants.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and configure environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/case_management_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### User Registration
1. Visit the registration page
2. Choose your user role (Client, Lawyer, Judge, Plaintiff)
3. Fill in the required information
4. For lawyers: Provide bar number and specializations
5. For judges: Provide court assignment

### Creating Cases (Client Role)
1. Login as a client
2. Navigate to "New Case" from the dashboard
3. Fill in case details including title, description, case type, and priority
4. Submit the case for review

### Managing Cases (Lawyer/Judge Role)
1. Login as a lawyer or judge
2. View assigned cases from the dashboard
3. Update case status and add progress notes
4. Assign resources and schedule hearings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/password` - Update password

### Cases
- `GET /api/cases` - Get cases (filtered by user role)
- `POST /api/cases` - Create new case
- `GET /api/cases/:id` - Get specific case
- `PUT /api/cases/:id` - Update case
- `POST /api/cases/:id/updates` - Add case update
- `GET /api/cases/dashboard/stats` - Get dashboard statistics

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/lawyers` - Get all lawyers
- `GET /api/users/judges` - Get all judges
- `PUT /api/users/:id` - Update user profile

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/case_management_system
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Database Schema

### User Model
- firstName, lastName, email, password
- role (client, lawyer, judge, plaintiff)
- phone, address
- Role-specific fields (barNumber for lawyers, courtAssignment for judges)
- specialization array
- timestamps

### Case Model
- caseNumber (auto-generated)
- title, description, caseType
- client, plaintiff, assignedLawyer, assignedJudge references
- status, priority, filingDate, hearingDate
- documents array
- updates array with timeline
- tags array

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please create an issue in the GitHub repository. 
