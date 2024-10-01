# Transaction Management System

## Description

This project is a backend that allows users to request transactions, which must be validated by an admin before completion.
It is built with NestJS and follows Domain-Driven Design (DDD) principles to ensure a clean, scalable, and secure architecture.

### Features

* Authentication: Users and admins can log in.
* Transaction Requests: Users can create transaction requests.
* Validation: Admins approve or reject transaction requests.
* Transaction Status: Approved transactions are marked as completed.
* Security: JWT authentication and role-based authorization.

## Technologies Used

- **NestJS**: Backend framework.
- **PostgreSQL**: Relational database.
- **Docker**: Containers for the application and database.
- **Jest**: Testing framework.

## Prerequisites

- Make sure you have [Docker](https://www.docker.com/) installed.

### Project Structure

```ini
src/
├── auth/               # Authentication module
├── transactions/       # Transactions module
├── shared/             # Shared modules, utilities, and exceptions
├── main.ts             # Main entry point of the application
├── app.module.ts       # Root application module

```

## Scripts

```bash
# install dependencies
npm install

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod

# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/cleider87/transactions-api.git
cd transactions-api
```

### 2. Configure Environment Variables
Ensure that the database environment variables are correctly set in .env.docker

```ini
APP_NAME: Transactions API
APP_PORT: 3000

DB_TYPE: postgres
DB_HOST: localhost
DB_PORT: 5432
DB_USERNAME: myuser
DB_PASSWORD: mypassword
DB_NAME: mydatabase
JWT_SECRET: myjwtsecret
JWT_EXPIRATION_TIME: 3600s
AUTHENTICATION_SERVER: http://localhost:3000/api
API_PREFIX: api
LOG_LEVEL: debug
```

### 3. Build and Run the Application with Docker

```bash
docker compose up --build
```

This will start the following services:

* PostgreSQL: Running on port 5432.
* NestJS: The API will be available on port 3000.
* pgAdmin (optional): A graphical interface for managing the database, available on port 5050

### 4. Access the Application
Once the services are running:

* The NestJS API will be accessible at http://localhost:3000/api.
    * Available Endpoints
        * Authentication
            * POST /auth/login: Logs in a user and retrieves a JWT token.
            * POST /users/register: Registers a new user.
            * POST /users/verify: Verify users token.

        * Transactions
            * POST /transactions/request: Submits a transaction request.
            * PATCH /transactions/:id/approve: Approves a transaction.
            * PATCH /transactions/:id/reject: Rejects a transaction.

* If using pgAdmin, it will be available at http://localhost:5050.
  * user: admin@admin.com
  * pass: admin

### 5. Shut Down Services

```bash
docker compose down
```


### 6. Importing the Postman Collection (Optional)
To import the Postman collection for the Transactions API, follow these steps:

1. **Open Postman**: Launch the Postman application on your computer.

2. **Navigate to the Import Section**:
   - Click on the **Import** button located in the top left corner of the Postman interface.

3. **Select the File**:
   - In the Import modal, choose the **Upload Files** tab.
   - Click on the **Choose Files** button.
   - Navigate to the directory where the `transactions-api.json` file is located (e.g., `postman/transactions-api.json`).
   - Select the `transactions-api.json` file and click **Open**.

4. **Import the Collection**:
   - Once the file is selected, click the **Import** button in the modal.
   - Postman will process the file and add the collection to your workspace.

5. **Access the Collection**:
   - After the import is complete, you can find the collection in the left sidebar under the **Collections** tab.
   - Click on the collection to view its requests, environments, and other settings.

6. **Configure Environment Variables** (if applicable):
   - If the collection requires specific environment variables, click on the **Environment** dropdown at the top right corner of Postman.
   - Select the appropriate environment or create a new one with the necessary variables.

7. **Start Testing**:
   - You can now select individual requests from the collection and execute them to test the Transactions API.

### Download the Collection File
You can download the Postman collection file directly from the following link: [Download transactions-api.json](postman/transactions-api.json)