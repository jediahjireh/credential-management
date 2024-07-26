// routes/organisationalUnit.routes.js - define organisational unit routes with permissions

const express = require('express');
const router = express.Router();
const organisationalUnitController = require('../controllers/organisationalUnit.controller.js');
// import checkPermissions middleware
const checkPermissions = require('../middleware/checkPermissions.js');

// view organisational unit data
router.get('/organisational-units', checkPermissions(['normal', 'management', 'admin']), organisationalUnitController.getOUs);
// define route for adding a new credential
router.post('/add-credential', checkPermissions(['normal', 'management', 'admin']), organisationalUnitController.addCredential);
// define route for updating credentials
router.put('/update-credentials', checkPermissions(['management', 'admin']), organisationalUnitController.updateCredentials);
// define route for unassigning a user from an OU
router.put('/unassign-ou', checkPermissions(['admin']), organisationalUnitController.unassignOU);
// define route for unassigning a user from a division
router.put('/unassign-division', checkPermissions(['admin']), organisationalUnitController.unassignDivision);
// define route for assigning a user to a new OU
router.put('/assign-ou', checkPermissions(['admin']), organisationalUnitController.assignOU);
// define route for assigning a user to a new division
router.put('/assign-division', checkPermissions(['admin']), organisationalUnitController.assignDivision);

// export router
module.exports = router;