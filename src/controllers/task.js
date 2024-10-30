const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');


const getTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, title, description } = req.query;
    const tasks = await taskService.getTasks(req.user.id, {
      page,
      limit,
      status,
      title,
      description,
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};


const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTask(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};


const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await taskService.createTask(req.user.id, req.body);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};


const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};


const deleteTask = async (req, res, next) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};


const updateTaskStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await taskService.updateTaskStatus(req.params.id, req.user.id, req.body.status);

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task status updated successfully', task });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
