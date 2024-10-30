const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const taskController = require('../controllers/task');
const { body, query } = require('express-validator');

router.use(authMiddleware);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
    query('status').optional().isIn(['pending', 'in_progress', 'completed']),
    query('title').optional().isString(),
    query('description').optional().isString(),
  ],
  taskController.getTasks
);

router.get('/:id', taskController.getTask);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
  ],
  taskController.createTask
);

router.put(
  '/:id',
  [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
  ],
  taskController.updateTask
);

router.delete('/:id', taskController.deleteTask);

router.patch(
  '/:id/status',
  [
    body('status').notEmpty().isIn(['pending', 'in_progress', 'completed']),
  ],
  taskController.updateTaskStatus
);

module.exports = router;
