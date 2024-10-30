const { User } = require('../models');


const getUsers = async () => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email'],
  });
  return users;
};

const getUser = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email'],
  });
  return user;
};

const createUser = async (userData) => {
  const { name, email } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.status = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
  });

  return user;
};

const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }

  const { name, email } = userData;

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email already in use');
      error.status = 400;
      throw error;
    }
    user.email = email;
  }

  if (name !== undefined) user.name = name;

  await user.save();

  return user;
};

const deleteUser = async (id) => {
  const deleted = await User.destroy({
    where: {
      id,
    },
  });

  return deleted;
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
