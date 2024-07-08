const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Disable logging for test output clarity
});

const User = require('./user')(sequelize);
const Organisation = require('./organisation')(sequelize);

module.exports = { sequelize, User, Organisation };
