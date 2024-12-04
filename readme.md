# Role-Based Access Control (RBAC) System

## Overview

This project implements a comprehensive **Authentication**, **Authorization**, and **Role-Based Access Control (RBAC)** system for managing user access in a secure and scalable manner. The solution ensures that users can only access resources and perform actions permitted by their roles. It uses **Node.js**, **Express**, and **MongoDB** for the backend and **React** for the frontend.

---

## Key Features

### Backend
- **Authentication**: Secure user registration, login, and logout using **JWT (Access and Refresh Tokens)**.
- **Authorization**: Enforces permissions for routes and resources based on user roles.
- **RBAC**: Implements role-based restrictions with three predefined roles: **Admin**, **Moderator**, and **User**.
- **Email Verification**: Users must verify their email before gaining full access.
- **Security Best Practices**:
  - Passwords hashed with **bcrypt**.
  - Tokens stored securely with proper expiration handling.

### Frontend
- **Dynamic Role-Based Navigation**: Users see different content and accessible pages based on their roles.
- **React Context API**: Manages authentication state globally.
- **Protected Routes**: Ensures only authorized users can access restricted pages.
- **Responsive and Intuitive UI**.

---

## Tech Stack

### Backend
- **Node.js**
- **Express**
- **MongoDB**
- **JWT** for authentication
- **Nodemailer** for email services

### Frontend
- **React**
- **React Router** for navigation
- **Axios** for API communication

---

## Installation and Setup

### Prerequisites
- Node.js and npm installed
- MongoDB cluster (or local instance)
- Verified email credentials for testing

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend

2. Install dependencies:
   ```bash
   npm install

3. Create a .env file:
   ```bash
   PORT=4000
   CORS_ORIGIN=http://localhost:3000
   MONGO_URI=<Your MongoDB Connection String>
   ACCESS_TOKEN_SECRET=<Your Access Token Secret>
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=<Your Refresh Token Secret>
   REFRESH_TOKEN_EXPIRY=10d
   EMAIL=<Your Email Address>
   APP_PSWD=<Your Email Password>
   EMAIL_VERIFICATION_SECRET=<Your Email Verification Secret>

4. Start the server:
   ```bash
   npm start

5. The backend will be live at http://localhost:4000.


### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd frontend

2. Install dependencies:
    ```bash
   npm install

3. Start the development server:
    ```bash 
   npm start

4. Access the frontend at http://localhost:3000.


### Demo
## Users and Roles

# Admin:
    Email: admin@example.com
    Password: AdminPass123
# Moderator:
    Email: moderator@example.com
    Password: ModPass123
# User:
    Email: user@example.com
    Password: UserPass123