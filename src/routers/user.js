const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { body, param } = require('express-validator');

router.get('/', userController.getUsers);

router.get(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
  ],
  userController.getUser
);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  userController.createUser
);

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
    body('name').optional().isString(),
    body('email').optional().isEmail().withMessage('Valid email is required'),
  ],
  userController.updateUser
);

router.delete(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
  ],
  userController.deleteUser
);

module.exports = router;
