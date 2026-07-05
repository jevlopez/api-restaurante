const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const mesaController = require('../controllers/mesaController');

/**
 * @swagger
 * /api/mesas:
 *   post:
 *     summary: Crear una nueva mesa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: integer
 *               capacidad:
 *                 type: integer
 *               disponible:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Mesa creada exitosamente
 */
router.post('/', verificarToken, mesaController.crearMesa);

/**
 * @swagger
 * /api/mesas:
 *   get:
 *     summary: Listar todas las mesas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mesas
 */
router.get('/', verificarToken, mesaController.listarMesas);

/**
 * @swagger
 * /api/mesas/{id}:
 *   get:
 *     summary: Obtener una mesa por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Mesa encontrada
 */
router.get('/:id', verificarToken, mesaController.obtenerMesa);

/**
 * @swagger
 * /api/mesas/{id}:
 *   put:
 *     summary: Actualizar una mesa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: integer
 *               capacidad:
 *                 type: integer
 *               disponible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Mesa actualizada
 */
router.put('/:id', verificarToken, mesaController.actualizarMesa);

/**
 * @swagger
 * /api/mesas/{id}:
 *   delete:
 *     summary: Eliminar una mesa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Mesa eliminada
 */
router.delete('/:id', verificarToken, mesaController.eliminarMesa);

module.exports = router;
