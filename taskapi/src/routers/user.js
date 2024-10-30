const { Router } = require('express');
const auth = require('../middleware/auth.js');

const router = Router();

const { getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
} = require("../controllers/user.js");

router.use(auth);

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);

module.exports = router;
