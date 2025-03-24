# Authentication Backend Service

A robust and secure Node.js authentication backend service with JWT token authentication, email verification, and MongoDB integration.

## Features

- **User Authentication**: Secure signup and login functionality
- **JWT Authentication**: Token-based authentication system
- **Email Verification**: Verification emails for new user accounts
- **Password Management**: Reset password functionality with email notifications
- **MongoDB Integration**: Persistent data storage with MongoDB
- **RESTful API**: Clean API endpoints for client integration
- **Middleware Security**: Protection against common web vulnerabilities
- **Role-based Access Control**: Different access levels for users

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Nodemailer for email functionality
- Bcrypt for password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- MongoDB (local instance or connection string to MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Yuno3848/authorization.git
cd authorization
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=your_email_service_provider
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
```

## Running the Application

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

- **POST /api/auth/signup** - Register a new user
- **POST /api/auth/login** - Authenticate a user and get a token
- **GET /api/auth/verify/:token** - Verify email with token
- **POST /api/auth/forgot-password** - Request a password reset
- **POST /api/auth/reset-password** - Reset password with token

### User Management

- **GET /api/users/profile** - Get current user profile
- **PUT /api/users/profile** - Update user profile
- **DELETE /api/users/:id** - Delete user (admin only)

## Usage Examples

### Register a new user

```javascript
fetch('/api/auth/signup', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
},
body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123',
    firstName: 'John',
    lastName: 'Doe',
}),
})
.then(response => response.json())
.then(data => console.log(data));
```

### Login

```javascript
fetch('/api/auth/login', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
},
body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123',
}),
})
.then(response => response.json())
.then(data => {
    // Store the token
    localStorage.setItem('token', data.token);
});
```

### Authenticated Request

```javascript
const token = localStorage.getItem('token');

fetch('/api/users/profile', {
method: 'GET',
headers: {
    'Authorization': `Bearer ${token}`,
},
})
.then(response => response.json())
.then(data => console.log(data));
```

## Configuration

You can configure additional settings in the `.env` file:

- **PORT**: The port on which the server will run (default: 3000)
- **MONGODB_URI**: Connection string for MongoDB
- **JWT_SECRET**: Secret key for JWT tokens
- **JWT_EXPIRES_IN**: Token expiration time (default: '1d')
- **EMAIL_SERVICE**: Email service provider (e.g., Gmail, SendGrid)
- **EMAIL_USER**: Email username for sending emails
- **EMAIL_PASS**: Email password or app-specific password

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400** - Bad Request (invalid input)
- **401** - Unauthorized (invalid credentials or token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource not found)
- **500** - Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on the GitHub repository.
