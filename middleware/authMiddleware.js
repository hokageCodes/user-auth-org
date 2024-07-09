const jwt = require('jsonwebtoken');
const { User, OrganisationUser } = require('../models');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Fetch organisation user relationship
    const orgUser = await OrganisationUser.findOne({
      where: {
        userId: user.userId,
      },
    });

    req.user = {
      userId: user.userId,
      organisationId: orgUser ? orgUser.organisationId : null,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authenticate;