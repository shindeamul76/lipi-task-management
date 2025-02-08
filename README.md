<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/shindeamul76/lipi-task-management.git">
   <img src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/cf/39/79/cf3979fe-a666-63f1-a7c3-84bf27e563a2/AppIcon-0-0-1x_U007emarketing-0-10-0-85-220.png/1200x600wa.png" alt="Logo">
  </a>

  <h3 align="center">Task Management API</h3>

  <p align="center">
    Become a Certified Career Planner.
    <br />
    <a href="https://y86aal8k6g.execute-api.ap-south-1.amazonaws.com/dev/hello"><strong>Deployed Lambda URL»</strong></a>
    <br />
    <br />
    <a href="https://github.com/shindeamul76/lipi-task-management.git">Discussions</a>
    ·
    <a href="https://y86aal8k6g.execute-api.ap-south-1.amazonaws.com/dev/api-docs">Swagger UI</a>
    ·
    <a href="https://lipi.game/">Website</a>
    ·
    <a href="https://github.com/shindeamul76/lipi-task-management.git/issues">Issues</a>
    ·
    <a href="https://lipi.game/">Roadmap</a>
  </p>
</p>




# Task Management System API

## Overview
A **Task Management System API** designed to manage tasks efficiently, allowing users to create, update, delete, search, and mark tasks as completed. This backend system is built using **Node.js** with **PostgreSQL** as the database and is deployed on **AWS Lambda with API Gateway**.

---

## Features

### 1. **Task Management**
- Create, update, delete tasks.
- Mark tasks as completed.
- Search tasks by keywords.
- Retrieve all tasks with calculated status.

### 2. **Task Status Calculation**
- **Pending:** Task is not started or due date is in the future.
- **Due Today:** Task's `due_date` matches the current date.
- **Overdue:** Task's `due_date` is before the current date and status is not `Completed`.
- **Completed:** Task is manually marked as completed.

### 3. **Error Handling & Validation**
- Proper validation for input fields.
- Meaningful error messages for failed operations.

### 4. **Deployment**
- Deployed on **AWS Lambda** with API Gateway.
- Can also run locally using Node.js Express.

---

## Built With
- **[Nest.js](https://nestjs.com/):** Backend framework.
- **[PostgreSQL](https://www.postgresql.org/):** Relational database.
- **[Prisma.io](https://www.prisma.io/):** Database ORM.
- **[Swagger](https://swagger.io/):** API documentation.
- **[AWS Lambda](https://aws.amazon.com/lambda/):** Serverless deployment.
- **[Serverless Framework](https://www.serverless.com/):** Deployment automation.

---

## API Endpoints

### **1. Create a Task**
- **Endpoint:** `/tasks`
- **Method:** `POST`
- **Description:** Accepts `title`, `description`, and an optional `due_date` (defaults to 7 days from the current date if not provided).

#### Request Body:
```json
{
  "title": "Complete assignment",
  "description": "Finish the backend assignment by the due date",
  "due_date": "2025-02-15" (optional)
}
```
#### Response:
```json
{
  "id": 1,
  "title": "Complete assignment",
  "description": "Finish the backend assignment by the due date",
  "due_date": "2025-02-15",
  "status": "Pending",
  "created_at": "2025-02-08T12:00:00.000Z",
  "updated_at": "2025-02-08T12:00:00.000Z"
}
```

---

### **2. Retrieve All Tasks**
- **Endpoint:** `/tasks`
- **Method:** `GET`
- **Description:** Fetch all tasks with their calculated status.

#### Response:
```json
[
  {
    "id": 1,
    "title": "Complete assignment",
    "description": "Finish the backend assignment by the due date",
    "due_date": "2025-02-15",
    "status": "Pending",
    "created_at": "2025-02-08T12:00:00.000Z",
    "updated_at": "2025-02-08T12:00:00.000Z"
  }
]
```

---

### **3. Update a Task**
- **Endpoint:** `/tasks/{id}`
- **Method:** `PUT`
- **Description:** Update task details (`title`, `description`, `due_date`) and log previous values.

#### Request Body:
```json
{
  "title": "Updated Task Title",
  "description": "Updated Description"
}
```

#### Response:
```json
{
  "message": "Task updated successfully"
}
```

---

### **4. Mark a Task as Completed**
- **Endpoint:** `/tasks/{id}/complete`
- **Method:** `PUT`
- **Description:** Marks the task as completed and updates the `completed_at` timestamp.

#### Response:
```json
{
  "message": "Task marked as completed"
}
```

---

### **5. Delete a Task**
- **Endpoint:** `/tasks/{id}`
- **Method:** `DELETE`
- **Description:** Deletes a task and returns the deleted task's details.

#### Response:
```json
{
  "message": "Task deleted successfully"
}
```

---

### **6. Search Tasks (Bonus)**
- **Endpoint:** `/tasks/search`
- **Method:** `GET`
- **Query Params:** `q` (search keyword for title or description)

#### Example Request:
```
GET /tasks/search?q=assignment
```

#### Response:
```json
[
  {
    "id": 1,
    "title": "Complete assignment",
    "description": "Finish the backend assignment by the due date",
    "status": "Pending"
  }
]
```

---

## Database Schema
```sql
enum TaskStatus {
  Completed
  Pending
  Overdue
  DueToday
}

model Task {
  id           Int        @id @default(autoincrement())
  title        String
  description  String?
  due_date     DateTime
  status       TaskStatus @default(Pending)
  completed_at DateTime?
  created_at   DateTime   @default(now())
  updated_at   DateTime   @updatedAt
}
```

---

## Getting Started

### **1. Clone the Repository**
```sh
git clone https://github.com/shindeamul76/lipi-task-management.git
cd task-management
```

### **2. Install Dependencies**
```sh
yarn install
```

### **3. Configure Environment Variables**
- Duplicate `.env.example` to `.env` and update:
  ```sh
  cp .env.example .env
  ```
  - Set `DATABASE_URL` for PostgreSQL connection.

### **4. Run Database Migrations**
```sh
yarn run prisma:deploy
```

### **5. Apply Database Migrations Locally**
```sh
yarn run prisma:generate
```

### **6. Start the Application**
```sh
yarn start 
```

### **7. Prisma Studio**
```sh
yarn prisma:studio
```

### **8. Open Swagger UI**
```sh
http://localhost:4000/api-docs/   or  

https://y86aal8k6g.execute-api.ap-south-1.amazonaws.com/dev/api-docs/
```


---

## Deployment

### **Build & Deploy**
```sh
yarn build
```
### **AWS Lambda Deployment (Serverless Framework)**
```sh
yarn serverless deploy
```

### **Local Setup**
To run locally using Node.js:
```sh
yarn start
```



