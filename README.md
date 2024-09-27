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

### Technologies

* NestJS
* TypeScript
* PostgreSQL
* Docker
* JWT for authentication

### Project Structure

```ini {"id":"01J8R210EEQ82T50BVHGQWWSPT"}
src/
├── auth/                # Authentication module
├── transactions/        # Transactions module
├── shared/              # Shared components
```

## Steps to Run Locally

```bash {"id":"01J8R210EEQ82T50BVHHS7469P"}
$ npm install
```

## Compile and run the project

```bash {"id":"01J8R210EEQ82T50BVHMCY6ARX"}
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash {"id":"01J8R210EEQ82T50BVHRB9SAQ1"}
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
