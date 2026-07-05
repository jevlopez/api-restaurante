const prisma = require('../config/prisma');

exports.crearReservacion = async (req, res) => {
  const { mesa_id, fecha, hora, personas } = req.body;
  const usuario_id = req.usuario?.id;

  if (!usuario_id) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  if (!mesa_id || !fecha || !hora || !personas) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  const mesaId = parseInt(mesa_id, 10);
  const personasNum = parseInt(personas, 10);
  const fechaObj = new Date(fecha);

  if (Number.isNaN(mesaId) || mesaId <= 0) {
    return res.status(400).json({ message: 'mesa_id inválido' });
  }

  if (Number.isNaN(personasNum) || personasNum <= 0) {
    return res.status(400).json({ message: 'personas inválido' });
  }

  if (Number.isNaN(fechaObj.getTime())) {
    return res.status(400).json({ message: 'fecha inválida' });
  }

  if (typeof hora !== 'string' || !hora.trim()) {
    return res.status(400).json({ message: 'hora inválida' });
  }

  try {
    const mesa = await prisma.mesa.findUnique({ where: { id: mesaId } });
    if (!mesa) {
      return res.status(404).json({ message: 'La mesa especificada no existe.' });
    }

    const ocupada = await prisma.reservacion.findFirst({
      where: {
        mesa_id: mesaId,
        fecha: fechaObj,
        hora: hora.trim(),
        estado: { not: 'cancelada' },
      },
    });

    if (ocupada) {
      return res.status(400).json({ message: 'La mesa ya está reservada en este horario.' });
    }

    const nuevaReserva = await prisma.reservacion.create({
      data: {
        fecha: new Date(fecha),
        hora: hora,
        personas: personas,
        mesa_id: parseInt(mesa_id, 10),
        usuario_id: usuario_id,
        estado: 'pendiente',
      },
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarReservacion = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID de reservación inválido' });
  }

  try {
    await prisma.reservacion.delete({ where: { id } });
    res.status(200).json({ message: 'Reservación eliminada' });
  } catch (error) {
    console.error('ELIMINAR RESERVACION ERROR', error.message || error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }
    res.status(500).json({ message: 'Error al eliminar reservación' });
  }
};
