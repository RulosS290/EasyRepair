const adminService = require('../services/adminService');

const getUsers = async (req, res) => {
    console.log(`[INFO] User ID: ${req.user.id} attempting to fetch all users`);

    if (req.user.type !== 'admin') {
        console.warn(`[WARNING] Unauthorized access attempt by User ID: ${req.user.id}`);
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const users = await adminService.getAllUsers();
        console.log(`[SUCCESS] Retrieved ${users.length} users`);
        res.json(users);
    } catch (error) {
        console.error(`[ERROR] Failed to fetch users:`, error);
        res.status(500).json({ error: "Error retrieving users", details: error.message });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    console.log(`[INFO] User ID: ${req.user.id} attempting to delete User ID: ${userId}`);

    if (req.user.type !== 'admin') {
        console.warn(`[WARNING] Unauthorized delete attempt by User ID: ${req.user.id}`);
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const result = await adminService.deleteUser(userId);
        console.log(`[SUCCESS] User ID: ${userId} deleted successfully`);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(`[ERROR] Failed to delete User ID: ${userId}:`, error);

        if (error.status === 404) {
            console.warn(`[WARNING] Attempted to delete non-existent User ID: ${userId}`);
            return res.status(404).json({ error: "User not found" });
        }

        res.status(error.status || 500).json({ error: error.message || "Error deleting user" });
    }
};

module.exports = { getUsers, deleteUser };