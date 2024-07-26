// models/OrganisationalUnit.js

// import dependencies
const mongoose = require('mongoose');

// define credential schema
const CredentialSchema = new mongoose.Schema({
  // define credential schema
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// define division schema
const DivisionSchema = new mongoose.Schema({
  // define division schema
  name: {
    type: String,
    required: true,
    trim: true
  },
  users: [{
    // reference to User
    type: String,
    ref: 'User'
  }],
  // embed credential schema
  credentials: [CredentialSchema]
});

// define organisational unit schema
const OrganisationalUnitSchema = new mongoose.Schema({
  // define organisational unit schema
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  users: [{
    // reference to User
    type: String,
    ref: 'User'
  }],
  // embed division schema
  divisions: [DivisionSchema]
});

// create and export OrganisationalUnit model
const OrganisationalUnit = mongoose.model('OrganisationalUnit', OrganisationalUnitSchema);

// custom validation to ensure unique credential names within a division
DivisionSchema.path('credentials').validate(function (credentials) {
  const uniqueNames = new Set(credentials.map(cred => cred.name));
  return uniqueNames.size === credentials.length;
}, 'Credential names must be unique within a division.');

// custom validation to ensure unique division names within an OU
OrganisationalUnitSchema.path('divisions').validate(function (divisions) {
  const uniqueNames = new Set(divisions.map(div => div.name));
  return uniqueNames.size === divisions.length;
}, 'Division names must be unique within an organisational unit.');

module.exports = OrganisationalUnit;