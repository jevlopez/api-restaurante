const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: "No autorizado" });
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token inválido" });
        req.usuario = decoded; // Guardar datos del usuario para usar en controladores
        next();
    });
};

const esAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') return res.status(403).json({ message: "Acceso denegado" });
    next();
};

module.exports = { verificarToken, esAdmin };