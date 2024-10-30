const { Task, Sequelize } = require('../models');
const { Op } = Sequelize;

const getTasks = async (req, res) => {
    try {
      const { page = 1, limit = 10, status, title, description } = req.query;
  
      const offset = (page - 1) * limit;
  
      const where = { userId: req.user.id };
  
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
  
      res.json({
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        tasks: rows,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

const getTask = async (req, res) => {
    const { id } = req.params;

    try {
        const foundTask = await Task.findOne({
            where: {
                id,
            },
        });
        res.json(foundTask);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    const { title, description, status } = req.body;

    try {
        const newTask = await Task.create({
            title,
            description,
            status,
            userId: req.user.id,
        });

        res.json(newTask);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const updatedTask = await Task.findByPk(id);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        updatedTask.title = title;
        updatedTask.description = description;
        updatedTask.status = status;
        await updatedTask.save();

        res.json(updatedTask);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Task.destroy({
            where: {
                id,
            },
        });

        if (deleted) {
            res.sendStatus(204);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'in_progress', 'completed'];
  
    try {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      const task = await Task.findOne({
        where: {
          id,
          userId: req.user.id,
        },
      });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      task.status = status;
      await task.save();
  
      res.json({ message: 'Task status updated successfully', task });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus };
