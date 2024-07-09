const express = require('express');
const OrganisationController = require('../controllers/organisationController');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, OrganisationController.getAllOrganisations);
router.get('/:id', authenticate, OrganisationController.getOrganisationById);
router.post('/', authenticate, OrganisationController.createOrganisation);
router.post('/:orgId/users', authenticate, OrganisationController.addUserToOrganisation);

module.exports = router;