const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

function isAdmin(req, res, next) {
    if (req.user.type !== "admin") {
        return res.status(404).json({ message: "Access denied. Admin permissions required." });
    }
    next();
}

module.exports = { authenticateToken, isAdmin };
