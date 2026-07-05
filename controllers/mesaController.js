const prisma = require('../config/prisma');

const parseMesaData = ({ numero, capacidad, disponible }) => {
  const numeroInt = parseInt(numero, 10);
  const capacidadInt = parseInt(capacidad, 10);
  return { numeroInt, capacidadInt, disponible: Boolean(disponible) };
};

exports.crearMesa = async (req, res) => {
  const { numero, capacidad, disponible } = req.body;

  if (!numero || !capacidad || disponible === undefined) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  const { numeroInt, capacidadInt, disponible: disponibleBool } = parseMesaData({ numero, capacidad, disponible });

  if (Number.isNaN(numeroInt) || numeroInt <= 0) {
    return res.status(400).json({ message: 'numero inválido' });
  }

  if (Number.isNaN(capacidadInt) || capacidadInt <= 0) {
    return res.status(400).json({ message: 'capacidad inválida' });
  }

  try {
    const mesa = await prisma.mesa.create({
      data: {
        numero: numeroInt,
        capacidad: capacidadInt,
        disponible: disponibleBool,
      },
    });

    res.status(201).json(mesa);
  } catch (error) {
    console.error('CREAR MESA ERROR', error.message || error);
    const isUnique = error.code === 'P2002' || error.code === '23505';
    res.status(isUnique ? 400 : 500).json({ message: isUnique ? 'El número de mesa ya existe' : 'Error al crear mesa' });
  }
};

exports.listarMesas = async (req, res) => {
  try {
    const mesas = await prisma.mesa.findMany();
    res.status(200).json(mesas);
  } catch (error) {
    console.error('LISTAR MESAS ERROR', error.message || error);
    res.status(500).json({ message: 'Error al listar mesas' });
  }
};

exports.obtenerMesa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID de mesa inválido' });
  }

  try {
    const mesa = await prisma.mesa.findUnique({ where: { id } });
    if (!mesa) {
      return res.status(404).json({ message: 'Mesa no encontrada' });
    }
    res.status(200).json(mesa);
  } catch (error) {
    console.error('OBTENER MESA ERROR', error.message || error);
    res.status(500).json({ message: 'Error al obtener mesa' });
  }
};

exports.actualizarMesa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { numero, capacidad, disponible } = req.body;

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID de mesa inválido' });
  }

  const data = {};
  if (numero !== undefined) {
    const numeroInt = parseInt(numero, 10);
    if (Number.isNaN(numeroInt) || numeroInt <= 0) {
      return res.status(400).json({ message: 'numero inválido' });
    }
    data.numero = numeroInt;
  }

  if (capacidad !== undefined) {
    const capacidadInt = parseInt(capacidad, 10);
    if (Number.isNaN(capacidadInt) || capacidadInt <= 0) {
      return res.status(400).json({ message: 'capacidad inválida' });
    }
    data.capacidad = capacidadInt;
  }

  if (disponible !== undefined) {
    data.disponible = Boolean(disponible);
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: 'No hay datos para actualizar' });
  }

  try {
    const mesa = await prisma.mesa.update({
      where: { id },
      data,
    });
    res.status(200).json(mesa);
  } catch (error) {
    console.error('ACTUALIZAR MESA ERROR', error.message || error);
    const isUnique = error.code === 'P2002' || error.code === '23505';
    if (isUnique) {
      return res.status(400).json({ message: 'El número de mesa ya existe' });
    }
    res.status(500).json({ message: 'Error al actualizar mesa' });
  }
};

exports.eliminarMesa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID de mesa inválido' });
  }

  try {
    await prisma.mesa.delete({ where: { id } });
    res.status(200).json({ message: 'Mesa eliminada' });
  } catch (error) {
    console.error('ELIMINAR MESA ERROR', error.message || error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Mesa no encontrada' });
    }
    res.status(500).json({ message: 'Error al eliminar mesa' });
  }
};
