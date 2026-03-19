# Connect

A modern chat application built with React, Node.js, Express, Socket.IO, and MongoDB.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- MongoDB

### Setting up the Backend

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following content:

```
MONGODB_URI=mongodb://localhost:27017/connect
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:

```bash
npm start
```

The backend will run on port 5000.

### Setting up the Frontend

1. Navigate to the Frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on port 5173.

## Features

- Real-time messaging
- User authentication
- Group chats
- Read receipts
- Typing indicators
- User profile management

## Notes for Development

1. API calls will automatically use the base URL defined in `.env` file
2. React Router warnings about future flags have been addressed
3. Make sure both backend and frontend servers are running when testing the application