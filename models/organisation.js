'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Organisation = sequelize.define('Organisation', {
    orgId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Organisation.associate = (models) => {
    Organisation.belongsToMany(models.User, {
      through: 'OrganisationUser',
      foreignKey: 'organisationId',
    });
  };

  return Organisation;
};