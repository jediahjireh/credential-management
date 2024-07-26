// middleware/checkPermissions.js

// import dependencies
const jwt = require('jsonwebtoken');

// store .env data
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'jwt-secret';

// check user permissions based on role and requested action
const checkPermissions = (roles = []) => {
  // if roles parameter is a string, convert to array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // get user token from headers
    const token = req.headers['authorization']?.split(' ')[1];

    // handle missing token
    if (!token) {
      return res.status(401).send({
        message: 'No token provided.',
        success: false
      });
    }

    try {
      // decode token
      const decoded = jwt.verify(token, jwtSecretKey);

      // check if user role is in allowed roles
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).send({
          message: 'Access forbidden: You do not have permission to access this resource.',
          success: false
        });
      }

      // set user data in request for further use
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).send({
        message: 'Invalid token.',
        data: err,
        success: false
      });
    }
  };
};

// export middleware
module.exports = checkPermissions;