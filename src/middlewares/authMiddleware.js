const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};

function isAdmin(req, res, next) {
    if (req.user.type !== "admin") {
        return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." });
    }
    next();
}

module.exports = { authenticateToken, isAdmin };
