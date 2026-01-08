# Issue Tracker Application

A full-stack web application for managing and tracking issues with user authentication, real-time dashboard, and advanced filtering capabilities.

## Technology Stack

### Frontend (Client)
- **Framework**: React 19 (via Vite.js)
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Language**: TypeScript

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Database**: MongoDB
- **ODM**: Mongoose

## Project Structure

```
project_IssueTracker/
├── client/                 # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── assets/         # Static images, icons
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/     # Buttons, Inputs, Modal, Badges
│   │   │   ├── layout/     # Navbar, Footer
│   │   │   └── issues/     # IssueCard, IssueList, IssueForm
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   │   ├── Auth/       # Login, Register
│   │   │   ├── Dashboard/  # Main dashboard
│   │   │   └── IssueDetails/ # Issue detail view
│   │   ├── services/       # API calls and service layer
│   │   ├── store/          # Redux store, slices, hooks
│   │   └── utils/          # Helper functions
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend application
│   ├── config/             # Database connection
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Auth and error middlewares
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── utils/              # Helper functions
│   ├── package.json
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project_IssueTracker
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

1. **Backend Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/issue-tracker
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

2. **Frontend Environment Variables** (Optional)
   
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   The backend will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## Available Scripts

### Frontend (Client)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend (Server)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Features

### Core Functionality
- **User Authentication**: Secure login and registration with JWT
- **Dashboard**: Real-time statistics with gradient stat cards
- **CRUD Operations**: Create, read, update, and delete issues
- **Status Management**: Track issues through Open → In Progress → Resolved workflow
- **Priority & Severity Levels**: Categorize issues by priority (Low, Medium, High) and severity (Critical, Major, Minor)
- **Advanced Filtering**: Search and filter issues by status, priority, and keywords
- **Pagination**: Customizable items per page (5, 10, 20, 50) with smart page navigation

### UI/UX Features
- **Modern Design**: Vibrant gradient backgrounds (violet/pink/cyan) with glassmorphism effects
- **Sticky Navbar**: Adaptive navbar that becomes compact on scroll with hamburger menu for mobile
- **Toast Notifications**: Real-time success/error messages positioned at top-center
- **Loading States**: Gradient spinners with smooth animations
- **Visual Indicators**: Color-coded badges with clear labels (Status:, Priority:, Severity:)
- **Floating Action Buttons**: 
  - Export CSV button (bottom-right, expandable on hover)
  - New Issue button (appears on scroll, stacked above export)
- **Dynamic Status Button, max 200 characters)
- description (String, required)
- status (Enum: Open, In Progress, Resolved) - Default: Open
- priority (Enum: Low, Medium, High) - Default: Medium
- severity (Enum: Critical, Major, Minor) - Default: Minor
- createdBy (ObjectId, ref: User, required
- **CSV Export**: Download filtered issue list with all details
- **Redux State**: Centralized state management for auth and issues
- **Real-time Updates**: Automatic refresh after create/update/delete operations

## Database Schema

### User Model
- email (String, unique, required)
- password (String, hashed, required)
- name (String)
- createdAt (Date)

### Issue Model
- title (String, required)
- description (String, required)
- status (Enum: Open, In Progress, Resolved, Closed)
- priority (Enum: Low, Medium, High)
- severity (Enum: Critical, Major, Minor)
- createdBy (ObjectId, ref: User)
- createdAt (Date)
- updatedAt (Date)

## Design System

### Color Palette
- **Primary Gradients**: 
  - Violet to Purple to Pink (#7C3AED → #9333EA → #EC4899)
  - Blue to Cyan (#3B82F6 → #06B6D4)
  - Emerald to Teal (#10B981 → #14B8A6)
  - Amber to Orange (#F59E0B → #F97316)
- **Backgrounds**: 
  - Gradient: Violet-100 via Pink-100 to Cyan-100
  - Cards: White/80 with backdrop blur
- **Text**: Dark Slate (#1E293B)

### Status Indicators
- **Open**: Blue (#3B82F6)
- **In Progress**: Yellow/Amber (#F59E0B)
- **Resolved**: Green (#10B981)

### Priority Badges
- **High**: Red (#EF4444)
- **Medium**: Yellow (#F59E0B)
- **Low**: Green (#10B981)

### Severity Badges
- **Critical**: Red (#EF4444)
- **Major**: Orange (#F97316)
- **Minor**: Blue (#3B82F6)

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `client`
3. Configure build command: `npm run build`
4. Configure output directory: `dist`

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set the root directory to `server`
3. Add environment variables in Railway dashboard
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email hirantharanathunga13@gmail.com or open an issue in the repository.
