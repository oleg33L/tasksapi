const { Router } = require('express');
const auth = require('../middleware/auth.js');

const router = Router();
const { getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTask,
    updateTaskStatus,
} = require("../controllers/task.js");

router.use(auth);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/:id", getTask);
router.put("/:id/status", updateTaskStatus);

module.exports = router;
