const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const reservacionController = require('../controllers/reservacionController');

/**
 * @swagger
 * /api/reservaciones:
 *   post:
 *     summary: Crear una nueva reservación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mesa_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *               personas:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Mesa ocupada
 */
router.post('/', verificarToken, reservacionController.crearReservacion);

/**
 * @swagger
 * /api/reservaciones/{id}:
 *   delete:
 *     summary: Eliminar una reservación
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
 *         description: Reservación eliminada
 *       404:
 *         description: Reservación no encontrada
 */
router.delete('/:id', verificarToken, reservacionController.eliminarReservacion);

module.exports = router;
