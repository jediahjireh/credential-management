// routes/user.routes.js - define user routes with permissions

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
// import checkPermissions middleware
const checkPermissions = require('../middleware/checkPermissions.js');

// define route for user login
router.post('/login', userController.login);
// define route for user registration
router.post('/register', userController.register);
// define route for getting all users
router.get('/users', checkPermissions(['normal', 'management', 'admin']), userController.getUsers);
// define route for changing user role
router.put('/change-role', checkPermissions(['admin']), userController.changeRole);

// export router
module.exports = router;