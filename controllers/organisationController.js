const { Organisation, User, OrganisationUser } = require('../models');

const getAllOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.findAll({
      include: [{
        model: User,
        through: {
          attributes: []
        },
        where: { userId: req.user.userId }
      }]
    });

    const orgResponse = organisations.map(org => ({
      orgId: org.orgId,
      name: org.name,
      description: org.description
    }));

    res.status(200).json({
      status: 'success',
      message: 'User Organisations retrieved successfully',
      data: {
        organisations: orgResponse
      },
    });
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Error fetching organisations', error: error.message });
  }
};

const getOrganisationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organisation = await Organisation.findByPk(id);

    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    const orgResponse = {
      orgId: organisation.orgId,
      name: organisation.name,
      description: organisation.description
    }

    res.status(200).json({
      status: 'success',
      message: 'User Organisation retrieved successfully',
      data: orgResponse,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching organisation', error: error.message });
  }
};

const createOrganisation = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name){
      return res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
    }
    const organisation = await Organisation.create({
      orgId: Date.now().toString(),
      name,
      description,
    });

    await OrganisationUser.create({
      organisationId: organisation.orgId,
      userId: req.user.userId,
    });

    const orgResponse = {
      orgId: organisation.orgId,
      name: organisation.name,
      description: organisation.description
    }

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: orgResponse,
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad Request', message: 'Client error' });
  }
};

const addUserToOrganisation = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { userId } = req.body;

    // Check if the user already belongs to the organisation
    const existingUser = await OrganisationUser.findOne({
      where: {
        organisationId: orgId,
        userId: userId,
      },
    });

    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already belongs to this organisation' });
    }

    // Add user to the organisation
    await OrganisationUser.create({
      organisationId: orgId,
      userId: userId,
    });

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Error adding user to organisation', error: error.message });
  }
};

module.exports = {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation
}