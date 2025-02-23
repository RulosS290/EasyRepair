const adminService = require('../services/adminService');

const getUsers = async (req, res) => {
    if (req.user.type !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ error: "Error retrieving users", details: error.message });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    if (req.user.type !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const result = await adminService.deleteUser(userId);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error("Error in deleteUser:", error);

        if (error.status === 404) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(error.status || 500).json({ error: error.message || "Error deleting user" });
    }
};


module.exports = { getUsers,deleteUser };
