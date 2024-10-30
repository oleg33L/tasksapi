const { User } = require('../models');
const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Email already exists');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await User.create({ email, password: hashedPassword });

  const token = jwt.sign(
    { id: newUser.id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return token;
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 400;
    throw error;
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.status = 400;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return token;
};

module.exports = {
  register,
  login,
};
