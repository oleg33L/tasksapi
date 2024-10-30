const authService = require('../services/authService');
const { validationResult } = require('express-validator');


const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const token = await authService.register(email, password);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
