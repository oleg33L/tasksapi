const { User } = require('../models');

 const getUsers = async (req, res) => {
    try {
        const foundUsers = await User.findAll({
            attributes: ["id", "name", "email"],
        });
        res.json(foundUsers);
    } catch (error) { }
};

 const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const foundUser = await User.findOne({
            where: {
                id,
            },
        });
        res.json(foundUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

 const createUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const newUser = await User.create({
            name,
            email,            
        });

        res.json(newUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

 const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const updatedUser = await User.findByPk(id);
        updatedUser.name = name;
        updatedUser.email = email;
        
        await updatedUser.save();

        res.json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

 const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await User.destroy({
            where: {
                id,
            },
        });

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports = { getUsers, createUser, updateUser, deleteUser, getUser };