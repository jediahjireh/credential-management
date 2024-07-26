// models/User.js

// import dependencies
const mongoose = require('mongoose');

// define user schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['normal', 'management', 'admin'],
    default: 'normal'
  },
  // reference to Organisational Unit model
  organisationalUnit: [{
    type: String,
    ref: 'OrganisationalUnit'
  }]
});

// create and export User model
const User = mongoose.model('User', UserSchema);
module.exports = User;