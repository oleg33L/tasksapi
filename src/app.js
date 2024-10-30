require('dotenv').config();
const express = require('express');
const authRoutes = require('./routers/auth');
const taskRoutes = require('./routers/task.js');
const userRoutes = require('./routers/user.js');
const app = express();
const db = require('./models');

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/task', taskRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await db.sequelize.sync();

    app.listen(3000, () => console.log('Server running on port 3000'));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

startServer();