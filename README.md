# Task Manager – MERN Stack Application

A **production‑ready Task Management System** built using the **MERN stack** with **JWT‑based authentication** and **role‑based access control**. This project demonstrates real‑world backend authorization, scalable task handling, and clean frontend role segregation.

## Repository Purpose

This repository showcases:

* Secure authentication & authorization patterns
* Role‑based UI and API access
* Scalable task management logic used in real teams

## 🧠 Features

### 🔐 Authentication & Security

* JWT‑based authentication for secure session handling
* Role‑Based Access Control (RBAC)
* Protected frontend routes & secured backend APIs

### 👨‍💼 Team Leader Role

* View **100% of tasks** assigned across the team
* Filter tasks by:
  * Priority (High / Medium / Low)
  * Status (Remaining / In‑Work / Finished)
* Monitor overall team progress from a single dashboard

### 👤 User Role

* Access **only assigned tasks** (strict data isolation)
* Track task status across **3 lifecycle stages**
* Clear prioritization for focused execution

## 🧱 Tech Stack Used

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5, CSS3

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MongoDB
* Mongoose ODM

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/your-username/task-manager-mern.git

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the Application

```bash
# Start backend
npm run dev

# Start frontend
npm start
```

---

## 🧪 API & Auth Flow

* JWT token generated on login
* Token stored client‑side and sent via Authorization headers
* Backend middleware validates token and role before request execution
