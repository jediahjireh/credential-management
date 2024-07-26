// controllers/organisationalUnit.controller.js

// import schema
const OrganisationalUnit = require('../models/OrganisationalUnit.js');
const User = require('../models/User.js');

// utility function to handle 401 unauthorised errors
const handleUnauthorisedError = (res, message = 'Error! Unauthorised request') => {
  // send error response with specific message (provided or default)
  const response = {
    message,
    success: false
  };
  res.status(401).send(response);
};

// get all organisational units
const getOUs = async (req, res) => {
  try {
    // find all organisational units and sort by _id
    const orgUnits = await OrganisationalUnit.find().sort({ "_id": 1 });

    // process each organisational unit
    const orgUnitsArray = orgUnits.map(orgUnit => {
      return {
        ouName: orgUnit.name,
        ouUsers: orgUnit.users,
        divisions: orgUnit.divisions.map(division => ({
          divisionName: division.name,
          divisionUsers: division.users,
          credentials: division.credentials.map(credential => ({
            credentialName: credential.name,
            credentialEmail: credential.email,
            credentialUsername: credential.username,
            credentialPassword: credential.password
          }))
        }))
      };
    });

    // create success response with organisational units data
    const response = {
      message: `Success! Your JWT was verified and you have access to these organisational units.`,
      organisationalUnits: orgUnitsArray
    };

    // send response to front end
    res.send(response);
  } catch (err) {
    // utility function for unauthorised errors
    handleUnauthorisedError(res, 'An error occurred while fetching organisational unit data.');
  }
};

// add a new credential to repository
const addCredential = async (req, res) => {
  // store inputted form data
  const { inputOuName, inputDivisionName, inputCredentialName, inputCredentialUsername, inputCredentialEmail, inputCredentialPassword } = req.body;

  try {
    // find the organisational unit with the specified name
    const fetchedOrgUnit = await OrganisationalUnit.findOne({ name: inputOuName });

    if (!fetchedOrgUnit) {
      return res.status(404).send({ message: `Organisational Unit: ${inputOuName} not found.`, success: false });
    }

    // find the division within the organisational unit
    const division = fetchedOrgUnit.divisions.find(division => division.name === inputDivisionName);

    if (!division) {
      return res.status(404).send({ message: `Division: ${inputDivisionName} not found in the specified Organisational Unit.`, success: false });
    }

    // check for unique credential name within the division
    const isNameUnique = !division.credentials.some(cred => cred.name === inputCredentialName);
    if (!isNameUnique) {
      return res.status(400).send({ message: `The credential name must be unique within the division. '${inputCredentialName}' already exists within the ${inputDivisionName} division.`, success: false });
    }

    // create new credential object
    const newCredential = {
      name: inputCredentialName,
      email: inputCredentialEmail,
      username: inputCredentialUsername,
      password: inputCredentialPassword
    };

    // add credential to the division's credentials array
    division.credentials.push(newCredential);

    // save updated organisational unit
    await fetchedOrgUnit.save();

    // send success response
    res.send({ message: `Success! New Credential '${inputCredentialName}' added to the ${inputDivisionName} division of Organisational Unit: ${inputOuName}.`, success: true });

  } catch (err) {
    // utility function for unauthorised errors
    handleUnauthorisedError(res, 'An error occurred while attempting to add the credential.');
  }
};

// update credentials
const updateCredentials = async (req, res) => {
  // store inputted form data
  const { inputOuName, inputDivisionName, inputCredentialName, inputCredentialUsername, inputCredentialEmail, inputCredentialPassword } = req.body;

  // create response to store data sent to front end
  let response;

  try {
    // find the organisational unit with the specified name
    const fetchedOrgUnit = await OrganisationalUnit.findOne({ name: inputOuName });

    if (!fetchedOrgUnit) {
      return res.status(404).send({ message: `Organisational Unit: ${inputOuName} not found.`, success: false });
    }

    // find the division within the organisational unit
    const division = fetchedOrgUnit.divisions.find(division => division.name === inputDivisionName);

    if (!division) {
      return res.status(404).send({ message: `Division: ${inputDivisionName} not found in the specified Organisational Unit.`, success: false });
    }

    // find the credential with the specified name
    const credential = division.credentials.find(cred => cred.name === inputCredentialName);

    if (!credential) {
      response = {
        message: `Failed! Credential '${inputCredentialName}' not found in the ${inputDivisionName} division of Organisational Unit: ${inputOuName}.`,
        success: false
      };
      return res.send(response);
    }

    // update the credential details; preserve existing values if new values are not provided
    credential.name = inputCredentialName || credential.name;
    credential.username = inputCredentialUsername || credential.username;
    credential.email = inputCredentialEmail || credential.email;
    credential.password = inputCredentialPassword || credential.password;
    division.name = inputDivisionName || division.name;
    fetchedOrgUnit.name = inputOuName || fetchedOrgUnit.name;

    // save updated organisational unit
    await fetchedOrgUnit.save();

    response = {
      message: `Success! Updated Credential '${inputCredentialName}' in the ${inputDivisionName} division of Organisational Unit: ${inputOuName}.`,
      success: true
    };
    res.send(response);
  } catch (err) {
    // utility function for unauthorised errors
    handleUnauthorisedError(res, 'An error occurred while attempting to update the credentials.');
  }
};

// unassign a user from an organisational unit
const unassignOU = async (req, res) => {
  // store inputted form data
  const { userName, ouName } = req.body;

  // create response to store data sent to front end
  let response;

  try {
    // find the organisational unit
    const orgUnit = await OrganisationalUnit.findOne({ name: ouName });

    if (!orgUnit) {
      return res.status(404).send({
        message: `Organisational Unit: ${ouName} not found.`,
        success: false
      });
    }

    // check if user is assigned to the organisational unit
    if (!orgUnit.users.includes(userName)) {
      return res.status(400).send({
        message: `User ${userName} is not assigned to Organisational Unit: ${ouName}.`,
        success: false
      });
    }

    // remove user from the organisational unit's users list
    await OrganisationalUnit.updateOne(
      { name: ouName },
      { $pull: { users: userName } }
    );

    // remove user from all divisions within the organisational unit
    for (const division of orgUnit.divisions) {
      division.users = division.users.filter(user => user !== userName);
    }
    await orgUnit.save();

    // create success response
    response = {
      message: `Success! ${userName} has been unassigned from Organisational Unit: ${ouName} and all its divisions.`,
      success: true
    };
    res.send(response);

  } catch (err) {
    // utility function for unauthorised errors
    handleUnauthorisedError(res, `An error occurred while attempting to unassign ${userName} from Organisational Unit: ${ouName} and all its divisions.`);
  }
};

// assign a user to an organisational unit
const assignOU = async (req, res) => {
  // store inputted form data
  const { userName, ouName } = req.body;

  // create response to store data sent to front end
  let response;

  try {
    // find user by username
    const user = await User.findOne({ username: userName });

    // check if user exists
    if (!user) {
      return res.status(404).send({
        message: `User: ${userName} not found.`,
        success: false
      });
    }

    // find the organisational unit
    const orgUnit = await OrganisationalUnit.findOne({ name: ouName });

    if (!orgUnit) {
      return res.status(404).send({
        message: `Organisational Unit: ${ouName} not found.`,
        success: false
      });
    }

    // check if user is already assigned to the organisational unit
    if (orgUnit.users.includes(userName)) {
      return res.status(400).send({
        message: `User ${userName} is already assigned to Organisational Unit: ${ouName}.`,
        success: false
      });
    }

    // add user to the organisational unit's users list
    await OrganisationalUnit.updateOne(
      { name: ouName },
      { $addToSet: { users: userName } }
    );

    response = {
      message: `Success! ${userName} has been assigned to Organisational Unit: ${ouName}.`,
      success: true
    };
    res.send(response);
  } catch (err) {
    // utility function for unauthorised errors
    handleUnauthorisedError(res, `An error occurred while attempting to assign ${userName} to Organisational Unit: ${ouName}.`);
  }
};

// unassign a user from a division
const unassignDivision = async (req, res) => {
  // store inputted form data
  const { userName, divisionName, ouName } = req.body;

  // create response to store data sent to front end
  let response;

  try {
    // find the organisational unit
    const orgUnit = await OrganisationalUnit.findOne({ name: ouName });

    if (!orgUnit) {
      return res.status(404).send({
        message: `Organisational Unit: ${ouName} not found.`,
        success: false
      });
    }

    // find the division within the organisational unit
    const division = orgUnit.divisions.find(division => division.name === divisionName);

    if (!division) {
      return res.status(404).send({
        message: `Division: ${divisionName} not found in the specified Organisational Unit.`,
        success: false
      });
    }

    // check if user is assigned to the division
    if (!division.users.includes(userName)) {
      return res.status(400).send({
        message: `User ${userName} is not assigned to the ${divisionName} division in Organisational Unit: ${ouName}.`,
        success: false
      });
    }

    // remove user from the division's users list
    division.users = division.users.filter(user => user !== userName);
    await orgUnit.save();

    // create success response
    response = {
      message: `Success! ${userName} has been unassigned from the ${divisionName} division in Organisational Unit: ${ouName}.`,
      success: true
    };
    res.send(response);
  } catch (err) {
    // utility function for unauthorised errors
    handleUnauthorisedError(res, `An error occurred while trying to unassign ${userName} from the ${divisionName} division in Organisational Unit: ${ouName}.`);
  }
};

// assign a user to a division within an organisational unit
const assignDivision = async (req, res) => {
  // store inputted form data
  const { userName, divisionName, ouName } = req.body;

  // create response to store data sent to front end
  let response;

  try {
    // find user by username
    const user = await User.findOne({ username: userName });

    // check if user exists
    if (!user) {
      return res.status(404).send({
        message: `User: ${userName} not found.`,
        success: false
      });
    }

    // find the organisational unit
    const orgUnit = await OrganisationalUnit.findOne({ name: ouName });

    if (!orgUnit) {
      return res.status(404).send({
        message: `Organisational Unit: ${ouName} not found.`,
        success: false
      });
    }

    // find the division within the organisational unit
    const division = orgUnit.divisions.find(division => division.name === divisionName);

    if (!division) {
      return res.status(404).send({
        message: `Division: ${divisionName} not found in the specified Organisational Unit.`,
        success: false
      });
    }

    // check if user is already assigned to the division
    if (division.users.includes(userName)) {
      return res.status(400).send({
        message: `User ${userName} is already assigned to the ${divisionName} division in Organisational Unit: ${ouName}.`,
        success: false
      });
    }

    // add user to the division's users list
    division.users.push(userName);

    // add user to the organisational unit's users list if not already present
    if (!orgUnit.users.includes(userName)) {
      orgUnit.users.push(userName);
    }

    await orgUnit.save();

    response = {
      message: `Success! ${userName} has been assigned to the ${divisionName} division in Organisational Unit: ${ouName}.`,
      success: true
    };
    res.send(response);
  } catch (err) {
    // utility function for unauthorised errors
    handleUnauthorisedError(res, `An error occurred while trying to assign ${userName} to the ${divisionName} division in Organisational Unit: ${ouName}.`);
  }
};
// export functions
module.exports = {
  getOUs,
  addCredential,
  updateCredentials,
  unassignOU,
  unassignDivision,
  assignOU,
  assignDivision
};