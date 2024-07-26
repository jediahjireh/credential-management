// index.js

// import dependencies
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

// create app instance
const app = express();
// middleware
app.use(cors());
app.use(helmet());

// import routes
const userRoutes = require('./routes/user.routes.js');
const organisationalUnitRoutes = require('./routes/organisationalUnit.routes.js');

// parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// handle CORS issues
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// use routes - configure API endpoints
app.use('/api/user', userRoutes);
app.use('/api/ou', organisationalUnitRoutes);

// catch-all handler for any request that doesn't match an API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // log the error stack
  res.status(500).send('View errors to be fixed!');
});

// export app
module.exports = app;
