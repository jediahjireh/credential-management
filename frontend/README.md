# Credential Management Frontend

Welcome to the frontend of the Credential Management Project! This project is designed to provide a user-friendly interface for managing credentials across different organisational units and divisions.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Contributing](#contributing)
- [Credits](#credits)

## Features

- **User Management**: View and manage users across different roles (Normal, Management, Admin).
- **Organisational Units (OUs)**: Assign and unassign users to/from OUs.
- **Divisions**: Manage user assignments to various divisions within OUs.
- **Role Management**: Change user roles and access permissions.

## Technologies Used

- **React**: Frontend library for building the user interface.
- **Vite**: Build tool and development server for a fast development experience.
- **React Bootstrap**: Styling and components for a responsive layout.
- **React Hooks**: For managing state and side effects in functional components.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) for package management

### Installation

1. Clone the repository:

```sh
git clone https://github.com/jediahjireh/credential-management.git
```

2. Navigate to the project directory:

```sh
cd credential-management
```

3. Navigate to the frontend directory:

```sh
cd frontend
```

4. Install dependencies:

```sh
npm install
```

## Project Structure

- `src/`

  - `components/` - Contains React components used in the application.
  - `api.jsx` - API utility functions for fetching and sending data.
  - `App.jsx` - Main application component.
  - `main.jsx` - Entry point for the React application.
  - `styles/` - Contains CSS files for styling.

- `package.json` - Project metadata and dependencies.

## Running the Project

To start the development server and open the application in your default browser, run:

```sh
npm start
```

The development server will run on `http://localhost:8000` by default.

## Testing

To run the tests for the project, use:

```sh
npm test
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## Credits

- Referenced [freeCodeCamp's "How to Build a Full-Stack Authentication App With React, Express, MongoDB, Heroku, and Netlify" resource](https://www.freecodecamp.org/news/how-to-build-a-fullstack-authentication-system-with-react-express-mongodb-heroku-and-netlify/) for guidance on ["How to Protect the Routes" in the frontend build](https://www.freecodecamp.org/news/how-to-build-a-fullstack-authentication-system-with-react-express-mongodb-heroku-and-netlify/#how-to-protect-the-routes)
- The landing page background is a [Video by Mati Mango from Pexels](https://www.pexels.com/video/close-up-view-of-a-man-doing-computer-programming-6330779/)

Happy coding!
