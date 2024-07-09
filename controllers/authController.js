const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organisation, OrganisationUser } = require('../models');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const organisation = await Organisation.create({
      orgId: Date.now().toString(),
      name: `${firstName}'s Organisation`,
    });

    await OrganisationUser.create({
      organisationId: organisation.orgId,
      userId: user.userId,
    });

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const userResponse = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };

    res.status(201).json({ status: 'success', message: 'Registration successful', data: { accessToken: token, user: userResponse } });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ status: 'Bad Request', message: 'Registration unsuccessful', statusCode: 400 });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ status: ' Bad Request', message: 'Authentication failed', statusCode: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ status: ' Bad Request', message: 'Authentication failed', statusCode: 401 });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const userResponse = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };

    res.status(200).json({ status: 'success', message: 'Login successful', data: { accessToken: token, user: userResponse } });
  } catch (error) {
    res.status(401).json({ status: ' Bad Request', message: 'Authentication failed', statusCode: 401 });
  }
};

module.exports = {
  login,
  register
}