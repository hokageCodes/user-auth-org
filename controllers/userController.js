const { User, OrganisationUser } = require('../models');

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ['userId', 'firstName', 'lastName', 'email', 'phone'],
        });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Check if the requesting user is the same as the user being queried
        if (req.user.userId !== id) {
            // Check if the requesting user belongs to any organization created by the queried user
            const orgUser = await OrganisationUser.findOne({
                where: {
                    organisationId: req.user.organisationId,
                    userId: id,
                },
            });

            if (!orgUser) {
                return res.status(403).json({ status: 'error', message: 'Forbidden' });
            }
        }

        const userResponse = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          };

        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: userResponse,
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Error fetching user', error: error.message });
    }
};

module.exports = { getUserById };