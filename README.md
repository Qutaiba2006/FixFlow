# FixFlow — Campus Maintenance Reporting System

FixFlow is a web application designed to make reporting and managing maintenance issues on a university campus easier.

The idea behind the project is simple. Students should be able to report problems around campus, follow their progress, and know when they have been fixed. At the same time, administrators and maintenance technicians need a way to organize reports, assign tasks, and track completed work.

I built FixFlow using the MERN stack as a full-stack web development project.

## Live Project

**Website:** https://fix-flow-one-green.vercel.app

**GitHub Repository:** https://github.com/Qutaiba2006/FixFlow

**Backend Health Check:** https://fixflow-backend-4hrf.onrender.com/api/health

## Main Features

### User Authentication

Users can register and log in to their accounts. Authentication is handled using JSON Web Tokens (JWT), and passwords are hashed before being stored in the database.

The application supports three user roles:

- **Student:** Creates reports, views maintenance updates, and interacts with other reports.
- **Technician:** Views assigned maintenance tasks and updates their status.
- **Admin:** Manages maintenance reports, assigns technicians, and monitors overall progress.

### Maintenance Reports

Students can create maintenance reports by providing a title, description, location, and images.

They can also view their previous reports, edit or delete their own open reports, and follow their progress through a maintenance timeline.

Each report has one of three statuses:

- Open
- In Progress
- Resolved

### Campus Feed

The Campus Feed allows users to view reports submitted around campus.

Users can search for reports, filter them by status, and browse results using pagination.

They can also support a report or indicate that they are affected by the same issue.

### Smart Priority System

FixFlow uses a priority score based on user interactions.

Reports receive additional priority when users support them or indicate that they are affected.

This helps highlight problems that impact more people on campus.

### Technician Dashboard

Technicians can view the reports assigned to them and update their status as maintenance work progresses.

Each status change is recorded in the report's maintenance timeline.

### Admin Dashboard

Administrators can assign reports to available technicians and manage their progress.

The admin dashboard also provides an overview of maintenance activity.

### Analytics

The Analytics page displays report statistics, including the number of open, in-progress, and resolved reports.

This gives administrators a clearer picture of maintenance activity across campus.

### Report Archive

When a report is marked as resolved, it becomes available in the Archive.

Archived reports remain stored in the database, so users can still view their details and maintenance history.

### Email Notifications

FixFlow uses Nodemailer to send email notifications when:

- An administrator assigns a report to a technician.
- A report's status changes to In Progress.
- A report is marked as Resolved.

Email sending was tested locally. Availability in the deployed version depends on the hosting provider's SMTP support.

## Technologies Used

### Frontend

- React.js
- JavaScript
- Vite
- Bootstrap 5
- React Router
- Axios
- HTML and CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- Nodemailer

### Deployment

- **Vercel:** Frontend hosting
- **Render:** Backend hosting
- **MongoDB Atlas:** Cloud database
- **Cloudinary:** Image storage

## Project Structure

```text
FixFlow/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── index.html
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

## Running the Project Locally

### Requirements

Before running the project, make sure you have:

- Node.js and npm installed
- A MongoDB database
- A Cloudinary account for image uploads
- SMTP credentials if you want to test email notifications

### 1. Clone the Repository

```bash
git clone https://github.com/Qutaiba2006/FixFlow.git
cd FixFlow
```

### 2. Backend Setup

Open the Backend directory and install the required dependencies:

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend` and configure the environment variables used by the application.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

Replace the example values with your own credentials. The `.env` file should not be committed to GitHub.

Start the backend:

```bash
npm start
```

The backend uses port 5000 by default unless another port is provided through the environment.

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

**API configuration:** The current frontend source uses the deployed Render backend URL. To connect the frontend to a locally running backend instead, change the API base URLs in the frontend source to `http://localhost:5000`.

## How FixFlow Works

A typical maintenance report goes through the following process:

1. A student creates a report describing a problem on campus.
2. The report appears in the Campus Feed, where other users can interact with it.
3. An administrator reviews the report and assigns it to a technician.
4. The assigned technician receives an email notification.
5. The technician starts working on the issue and updates the report status.
6. The student can follow the progress through the maintenance timeline.
7. Once the issue is resolved, the report moves to the Archive.

Throughout this process, the report history remains available for reference.

## What I Learned

Working on FixFlow helped me gain practical experience in connecting frontend and backend applications.

The main areas I worked on included building REST APIs, using MongoDB with Mongoose, implementing authentication and role-based authorization, handling image uploads, and integrating external services such as Cloudinary and Nodemailer.

I also gained experience deploying a full-stack application and dealing with the differences between local development and a production environment.

## Future Improvements

There are still areas I would like to improve, including more reliable handling of concurrent requests, better recovery when image operations fail, and a more robust email delivery system.

These improvements would make the application more reliable as the number of users and reports grows.

## Author

**Qutaiba Shakhatreh**

Software Engineering Student  
Jordan University of Science and Technology

GitHub: https://github.com/Qutaiba2006
