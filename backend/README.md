# Credential Management Backend

This is the backend component of a credential management system built using Express.js and MongoDB. This API allows users to manage credentials within organisational units. It supports user authentication, registration and CRUD operations for organisational units and credentials. Different user roles include Normal users, Management users and Admin users, each with specific permissions (role-based access control).

## Features

- User registration and login
- User role management
- Organisational unit and division management
- Credential repository management

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-the-api-with-postman)
- [User Routes](#user-routes)
- [Organisational Unit Routes](#organisational-unit-routes)
- [Contributing](#contributing)
- [Notes](#notes)
- [Credits](#credits)

## Prerequisites

1. [Node.js](https://nodejs.org/)
2. [MongoDB](https://www.mongodb.com/)
3. [Postman](https://www.postman.com/)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/jediahjireh/credential-management.git
```

2. Navigate into the project directory:

```sh
cd credential-management
```

3. Navigate to the backend directory:

```sh
cd backend
```

4. Install the necessary dependencies:

```sh
npm install
```

## Configuration

1. Create a `.env` file in the root of the backend project directory.

2. Add the following environment variables to the `.env` file:

```env
MONGO_URI=mongodb-connection-string
SECRET_KEY=secret-key
PORT=8080
```

- `MONGO_URI`: Your MongoDB connection string.
- `SECRET_KEY`: A secret key used for JWT token signing (generate using a secure method).
- `PORT`: The port number on which the server will run (default is 8080).

## Usage

1. Start the server:

```sh
npm start
```

2. The server will be available at `http://localhost:8080` unless otherwise specified.

## API Endpoints

### User Endpoints

- [GET /users](#3-get-users) - Retrieve a list of all users.
- [POST /login](#1-login) - Authenticate a user and generate a JWT token.
- [POST /register](#2-register) - Register a new user.
- [PUT /change-role](#4-change-user-role) - Update a user's role.

### Organisational Unit Endpoints

- [GET /organisational-units](#1-get-organisational-units) - Retrieve all organisational units.
- [POST /add-credential](#4-add-credential) - Add a new credential repository to a division in an OU.
- [PUT /update-credentials](#5-update-credentials) - Update a credential repository.
- [PUT /unassign-ou](#3-unassign-user-from-organisational-unit) - Remove a user from an organisational unit.
- [PUT /unassign-division](#7-unassign-user-from-division) - Remove a user from a division within an OU.
- [PUT /assign-ou](#2-assign-user-to-organisational-unit) - Assign a user to a new OU.
- [PUT /assign-division](#6-assign-user-to-division) - Assign a user to a division and its associated OU.

## Testing the API with Postman

- Open Postman and click on `Import`.
- Import the collection JSON file from the [tests](./tests/API/credential-management-API.postman_collection.json) directory.
- View API fetch results.
- Skip to [Step 4](#4-test-endpoints).

If you would like to simulate the API routes by yourself using Postman, follow these steps:

#### 1. Set Up Postman

- Download and install [Postman](https://www.postman.com/downloads/).

#### 2. Postman Collection

- Open Postman and create a new collection.
- Name it `Credential Management API`.

#### 3. Set Environment Variables

- Create a new Postman environment with the following variables:
  - `base_url`: `http://localhost:8080`
  - `token`: `<jwt-token>`

#### 4. Test Endpoints

- Use the provided endpoints and replace `<jwt-token>` with the actual token received from the login request.
- Ensure the server is running before sending requests.

#### 5. Save and Send Requests

- Click "Save" and then "Send" to test each endpoint.
- Verify the response status and body to ensure the routes work correctly.

## User Routes

### Authentication

#### 1. Login

- **Method**: `POST`
- **URL**: `http://localhost:8080/api/user/login`
- **Body** (raw JSON):
  ```json
  {
    "username": "jake",
    "password": "1212"
  }
  ```
- **Description**: Authenticate a user and retrieve a JWT token.

#### 2. Register

- **Method**: `POST`
- **URL**: `http://localhost:8080/api/user/register`
- **Body** (raw JSON):
  ```json
  {
    "username": "newuser",
    "password": "newpassword",
    "role": "normal"
  }
  ```
- **Description**: Register a new user.

### Authenticated Routes

#### 3. Get Users

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/user/users`
- **Headers**:
  - `Authorization`: `Bearer <jwt-token>`
- **Description**: Retrieve a list of all users. Accessible by `normal`, `management` and `admin` roles.

#### 4. Change User Role

- **Method**: `PUT`
- **URL**: `http://localhost:8080/api/user/change-role`
- **Body** (raw JSON):
  ```json
  {
    "selectedUserName": "jane",
    "selectedRole": "admin"
  }
  ```
- **Headers**:
  - `Authorization`: `Bearer <jwt-token>`
- **Description**: Change the role of a user. Accessible only by `admin` role.

## Organisational Unit Routes

### Organisational Units

#### 1. Get Organisational Units

**Method**: GET  
**URL**: `http://localhost:8080/api/ou/organisational-units`

**Headers**:

- `Authorization: Bearer <jwt-token>`

**Description**: Retrieve the list of all organisational units. Accessible by `normal`, `management` and `admin` roles.

**Body**: None

**Response Example**:

```json
{
  "message": "Success! Your JWT was verified and you have access to these OUs.",
  "username": "jake",
  "role": "admin",
  "organisationalUnits": [
    {
      "ouName": "News Management",
      "ouUsers": ["jake", "user456"],
      "divisions": [
        {
          "divisionName": "Writing",
          "divisionUsers": ["jake"],
          "credentials": [
            {
              "credentialName": "Example Credential",
              "credentialEmail": "example@example.com",
              "credentialUsername": "exampleUser",
              "credentialPassword": "examplePass"
            }
          ]
        }
      ]
    }
  ]
}
```

#### 2. Assign User to Organisational Unit

**Method**: PUT  
**URL**: `http://localhost:8080/api/ou/assign-ou`

**Headers**:

- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Description**: Assign a user to an organisational unit. Accessible by `admin` role only.

**Body (raw JSON)**:

```json
{
  "userName": "jake",
  "ouName": "News Management"
}
```

**Response Example**:

```json
{
  "message": "Success! jake has been assigned to News Management.",
  "successKey": true
}
```

#### 3. Unassign User from Organisational Unit

**Method**: PUT  
**URL**: `http://localhost:8080/api/ou/unassign-ou`

**Headers**:

- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Description**: Unassign a user from an organisational unit. Accessible by `admin` role only.

**Body (raw JSON)**:

```json
{
  "userName": "jake",
  "ouName": "News Management"
}
```

**Response Example**:

```json
{
  "message": "Success! jake has been unassigned from News Management and all its divisions.",
  "successKey": true
}
```

### Credentials

#### 4. Add Credential

**Method**: POST  
**URL**: `http://localhost:8080/api/ou/add-credential`

**Headers**:

- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Description**: Add a new credential to a specified division within an organisational unit. Accessible by `normal`, `management` and `admin` roles.

**Body (raw JSON)**:

```json
{
  "inputOuName": "News Management",
  "inputDivisionName": "Writing",
  "inputCredentialName": "New Credential",
  "inputCredentialUsername": "newUser",
  "inputCredentialEmail": "new@example.com",
  "inputCredentialPassword": "newPass"
}
```

**Response Example**:

```json
{
  "message": "Success! New Credential added to News Management's 'Writing' division.",
  "successKey": true
}
```

#### 5. Update Credentials

**Method**: PUT  
**URL**: `http://localhost:8080/api/ou/update-credentials`

**Headers**:

- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Description**: Update an existing credential in a specified division within an organisational unit. Accessible by `management` and `admin` roles.

**Body (raw JSON)**:

```json
{
  "inputOuName": "Software Reviews",
  "inputDivisionName": "Finances",
  "inputCredentialName": "Service1",
  "inputCredentialUsername": "updatedUser",
  "inputCredentialEmail": "updated@example.com",
  "inputCredentialPassword": "updatedPass"
}
```

**Response Example**:

```json
{
  "message": "Success! Updated Credential: 'Example Credential' in News Management's Writing division.",
  "successKey": true
}
```

### Divisions

#### 6. Assign User to Division

**Method**: PUT  
**URL**: `http://localhost:8080/api/ou/assign-division`

**Headers**:

- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Description**: Assign a user to a division within an organisational unit. The user will be added to both the division and the organisational unit. Accessible by `admin` role only.

**Body (raw JSON)**:

```json
{
  "divisionName": "Writing",
  "ouName": "News Management",
  "userName": "jake"
}
```

**Response Example**:

```json
{
  "message": "Success! jake has been assigned to News Management's Writing division.",
  "successKey": true
}
```

#### 7. Unassign User from Division

**Method**: PUT  
**URL**: `http://localhost:8080/api/ou/unassign-division`

**Headers**:

- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Description**: Unassign a user from a division within an organisational unit. The user remains assigned to the organisational unit. Accessible by `admin` role only.

**Body (raw JSON)**:

```json
{
  "divisionName": "Writing",
  "ouName": "News Management",
  "userName": "jake"
}
```

**Response Example**:

```json
{
  "message": "Success! jake has been unassigned to News Management's Writing division.",
  "successKey": true
}
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## Notes

- Ensure the server is running before testing the endpoints.
- Adjust IDs and data in the request bodies as necessary based on your setup.
- Ensure MongoDB is running and accessible via the URI provided in the `.env` file.
- Replace `<jwt-token>` with the actual token received from the login request.
- Ensure correct permissions for each role while testing.

## Credits

- Referenced [freeCodeCamp's "How to Build a Full-Stack Authentication App With React, Express, MongoDB, Heroku, and Netlify" resource](https://www.freecodecamp.org/news/how-to-build-a-fullstack-authentication-system-with-react-express-mongodb-heroku-and-netlify/) for guidance on ["How to Protect the Routes" in the frontend build](https://www.freecodecamp.org/news/how-to-build-a-fullstack-authentication-system-with-react-express-mongodb-heroku-and-netlify/#how-to-protect-the-routes)
- The landing page background is a [Video by Mati Mango from Pexels](https://www.pexels.com/video/close-up-view-of-a-man-doing-computer-programming-6330779/)

Happy coding!
