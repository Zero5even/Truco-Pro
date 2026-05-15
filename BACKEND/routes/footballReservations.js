import express from 'express';
import FootballReservation from '../models/FootballReservation.js';

const router = express.Router();

// GET — obtener reservas de un rango de fechas
router.get('/range', async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Parámetros 'start' y 'end' requeridos." });
    }

    const reservations = await FootballReservation.find({
      date: { $gte: start, $lte: end }
    });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — crear reserva
router.post('/', async (req, res) => {
  try {
    const { date, startTime, endTime, user } = req.body;

    if (!date || !startTime || !endTime || !user) {
      return res.status(400).json({ message: "Datos faltantes en la reserva." });
    }

    // Verificar si se pisa con otra reserva
    const overlap = await FootballReservation.findOne({
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (overlap) {
      return res.status(400).json({ message: "Esa franja horaria ya está reservada." });
    }

    const newRes = new FootballReservation({ date, startTime, endTime, user });
    await newRes.save();

    res.status(201).json({ success: true, message: "Reserva creada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
