const { Task, Sequelize } = require('../models');
const { Op } = Sequelize;

const validStatuses = ['pending', 'in_progress', 'completed'];


const getTasks = async (userId, { page, limit, status, title, description }) => {
  const offset = (page - 1) * limit;
  const where = { userId };

  if (status) {
    where.status = status;
  }
  if (title) {
    where.title = { [Op.iLike]: `%${title}%` };
  }
  if (description) {
    where.description = { [Op.iLike]: `%${description}%` };
  }

  const { count, rows } = await Task.findAndCountAll({
    where,
    attributes: ['id', 'title', 'description', 'status', 'userId'],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return {
    total: count,
    page: parseInt(page),
    pages: Math.ceil(count / limit),
    tasks: rows,
  };
};


const getTask = async (taskId, userId) => {
  const task = await Task.findOne({
    where: {
      id: taskId,
      userId,
    },
  });
  return task;
};


const createTask = async (userId, taskData) => {
  const { title, description, status } = taskData;

  const task = await Task.create({
    title,
    description,
    status,
    userId,
  });

  return task;
};


const updateTask = async (taskId, userId, taskData) => {
  const task = await Task.findOne({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    return null;
  }

  const { title, description, status } = taskData;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status) {
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status value');
    }
    task.status = status;
  }

  await task.save();

  return task;
};


const deleteTask = async (taskId, userId) => {
  const deleted = await Task.destroy({
    where: {
      id: taskId,
      userId,
    },
  });

  return deleted;
};


const updateTaskStatus = async (taskId, userId, status) => {
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status value');
  }

  const task = await Task.findOne({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    return null;
  }

  task.status = status;
  await task.save();

  return task;
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
