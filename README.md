# Issue Tracker Application

A full-stack web application for managing and tracking issues with user authentication, real-time dashboard, and advanced filtering capabilities.

## Technology Stack

### Frontend (Client)
- **Framework**: React 19 (via Vite.js)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router DOM
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
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend application
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
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

- **User Authentication**: Secure login and registration with JWT
- **Dashboard**: Real-time statistics and issue overview
- **CRUD Operations**: Create, read, update, and delete issues
- **Status Management**: Track issues through Open, In Progress, Resolved, and Closed states
- **Priority & Severity Levels**: Categorize issues by priority (Low, Medium, High) and severity (Critical, Major, Minor)
- **Advanced Filtering**: Search and filter issues by status, priority, and keywords
- **Visual Indicators**: Color-coded badges for quick status identification
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

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

## Color Palette

- **Primary (Actions)**: Royal Blue (#2563EB)
- **Backgrounds**: Slate Gray (#F8FAFC)
- **Text**: Dark Slate (#1E293B)
- **Status Indicators**:
  - Open: Blue/Gray
  - In Progress: Yellow/Amber
  - Resolved: Green
  - Critical: Red

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

This project is licensed under the ISC License.

## Support

For support, email hirantharanathunga13@gmail.com or open an issue in the repository.
