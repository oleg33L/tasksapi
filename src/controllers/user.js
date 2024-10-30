const userService = require('../services/userService');
const { validationResult } = require('express-validator');

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
