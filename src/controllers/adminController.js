const adminService = require('../services/adminService');

const getUsers = async (req, res) => {
    if (req.user.type !== 'admin') {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la lista de usuarios" });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    if (req.user.type !== 'admin') {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    try {
        const result = await adminService.deleteUser(userId);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Usuario eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
};

module.exports = { getUsers,deleteUser };
