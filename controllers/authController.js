const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

exports.register = async (req, res) => {
  const { nombre, correo, password } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.usuario.create({
      data: { nombre, correo, password: hashedPassword, rol: 'cliente' },
    });
    res.status(201).json({ message: 'Usuario creado', userId: user.id });
  } catch (error) {
    console.error('REGISTER ERROR', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    const isUniqueConstraint = error.code === 'P2002' || error.code === '23505';
    res.status(isUniqueConstraint ? 400 : 500).json({ error: isUniqueConstraint ? 'El correo ya existe' : 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  const { correo, password } = req.body || {};
  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    const user = await prisma.usuario.findUnique({ where: { correo } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '8h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('LOGIN ERROR', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
