'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: 'userId',
        as: 'tasks',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,      
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};