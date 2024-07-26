// controllers/user.controller.js

// import schema
const User = require('../models/User.js');
const OrganisationalUnit = require('../models/OrganisationalUnit.js');

// import dependencies
const jwt = require('jsonwebtoken');

// store .env data
const jwtSecret = process.env.JWT_SECRET_KEY || 'jwt-secret';

// user login
const login = async (req, res) => {
  // initialise response object
  let response = {};

  try {
    // check if user found
    const found = await User.findOne({
      username: req.body.username
    });

    // handle user not found
    if (!found) {
      response = {
        message: 'User not found. Double-check your username for errors or register a new user.'
      };
      return res.send(response);
    }

    // promise-based method to find user matching username and password
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password
    }).exec();

    // handle incorrect password
    if (!user) {
      response = {
        message: 'Invalid login! Please ensure that credentials are filled in and valid.'
      };
      return res.send(response);
    }

    // generate token with user details and role
    const token = jwt.sign({
      username: user.username,
      role: user.role
    }, jwtSecret, { algorithm: 'HS256' });

    // set response with user data and token
    response = {
      message: 'Successful login!',
      success: true,
      username: user.username,
      role: user.role,
      token: token
    };

    // return appropriate response
    res.send(response);
  } catch (err) {
    response = {
      message: 'Error during login!',
      data: err,
      success: false
    };
    res.send(response);
  }
};

// register new user
const register = async (req, res) => {
  // initialise response object
  let response = {};

  try {
    // promise-based method to check if user already exists
    const userExists = await User.findOne({
      username: req.body.username
    }).exec();

    // handle user already exists
    if (userExists) {
      response = {
        message: `${req.body.username} already exists in our database. Please register with a different username or login with existing credentials.`,
        success: false
      };
      return res.send(response);
    }

    // promise-based method to check if user email already in database
    const emailExists = await User.findOne({
      email: req.body.email
    }).exec();

    // handle user email already in database
    if (emailExists) {
      response = {
        message: `${req.body.email} already exists in our database. Please register with a different email address or login with existing credentials.`,
        success: false
      };
      return res.send(response);
    }

    // create new user
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      // set default role to 'normal' - can be adjusted by admins from the frontend
      role: 'normal'
    });

    // save new user
    await newUser.save();

    // generate token with new user details and role
    const token = jwt.sign({
      username: newUser.username,
      role: newUser.role
    }, jwtSecret, { algorithm: 'HS256' });

    // set response with user data and token
    response = {
      message: 'New user registered and found!',
      success: true,
      username: newUser.username,
      token: token
    };
    res.send(response);
  } catch (err) {
    response = {
      message: 'Error saving new user! Please ensure that credentials are filled in and valid.',
      success: false,
      data: err
    };
    res.send(response);
  }
};

// change user role
const changeRole = async (req, res) => {
  // store input data
  const { selectedUserName, selectedRole } = req.body;

  // initialise response object
  let response;

  try {
    // promise-based method to find selected user
    const user = await User.findOne({ username: selectedUserName }).exec();

    // handle user not found
    if (!user) {
      response = {
        message: 'User not found.',
        success: false
      };
      return res.send(response);
    }

    // check if role is the same
    if (user.role === selectedRole) {
      response = {
        message: `Role change failed! ${selectedUserName} is already '${selectedRole}'. Please select a different role.`,
        success: false
      };
      return res.send(response);
    }

    // update user role
    user.role = selectedRole;

    // save updated user
    await user.save();

    response = {
      message: `Success! ${selectedUserName}'s role changed to '${selectedRole}'.`,
      success: true
    };
    res.send(response);
  } catch (err) {
    response = {
      message: 'Error! Unauthorized request - invalid JWT.',
      data: err,
      success: false
    };
    res.send(response);
  }
};

// get all users
const getUsers = async (req, res) => {
  // initialise response object
  let response;

  // initialise users data by role
  const usersData = {
    normalUsers: [],
    managementUsers: [],
    adminUsers: []
  };

  // get user token from headers
  const token = req.headers['authorization'].split(' ')[1];

  try {
    // decode token
    const decoded = jwt.verify(token, jwtSecret);

    // promise-based method to find all users
    const users = await User.find().exec();

    // get all organisational units
    const organisationalUnits = await OrganisationalUnit.find().exec();

    // process each user
    await Promise.all(users.map(async (user) => {
      // filter the organisational units where the user is present
      const userOrganisationalUnits = organisationalUnits.filter(orgUnit =>
        orgUnit.users.includes(user.username)
      ).map(orgUnit => {
        // get divisions where the user is present
        const userDivisions = orgUnit.divisions.filter(division =>
          division.users.includes(user.username)
        ).map(division => ({
          divisionName: division.name
        }));

        return {
          ouName: orgUnit.name,
          divisions: userDivisions
        };
      });

      // prepare user details
      const userDetails = {
        username: user.username,
        email: user.email,
        role: user.role,
        organisationalUnits: userOrganisationalUnits
      };

      // add to appropriate array depending on role
      if (user.role === 'normal') {
        usersData.normalUsers.push(userDetails);
      } else if (user.role === 'management') {
        usersData.managementUsers.push(userDetails);
      } else if (user.role === 'admin') {
        usersData.adminUsers.push(userDetails);
      }
    }));

    response = {
      message: `Success! Your JWT was verified and you have access to the users collection, ${decoded.username}.`,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      normal: usersData.normalUsers,
      management: usersData.managementUsers,
      admin: usersData.adminUsers
    };

    // send JSON response
    res.status(200).json(response);
  } catch (err) {
    // send error response
    res.status(401).json({
      message: 'Error! Unauthorized request - invalid JWT.',
      // send the error message for debugging
      data: err.message,
      success: false
    });
    // log error details
    console.error(err);
  }
};

// export functions
module.exports = {
  login,
  register,
  changeRole,
  getUsers
};