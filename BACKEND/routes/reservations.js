// routes/reservas.js

import express from 'express';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// ===============================
//   OBTENER RESERVAS POR FECHA
// ===============================
router.get('/:date', async (req, res) => {
  try {
    const date = req.params.date; // fecha en formato YYYY-MM-DD

    if (!date || typeof date !== 'string' || date.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'La fecha proporcionada no es válida'
      });
    }

    // Buscamos todas las reservas de ese día exacto
    const reservations = await Reservation.find({ date });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
//       CREAR NUEVA RESERVA
// ===============================
router.post('/', async (req, res) => {
  const { date, shift, grillNumber, user } = req.body;

  try {
    // Validación básica
    if (!date || typeof date !== 'string' || date.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'La fecha enviada no es válida (debe ser YYYY-MM-DD)'
      });
    }

    const reservationDate = date.slice(0, 10); // aseguramos formato YYYY-MM-DD

    // Comprobamos si ya existe una reserva para esa parrilla y turno
    const existingReservation = await Reservation.findOne({
      date: reservationDate,
      shift,
      grillNumber
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: `La parrilla ${grillNumber} ya está reservada para el turno ${shift}`
      });
    }

    // Crear nueva reserva
    const newReservation = new Reservation({
      date: reservationDate,
      shift,
      grillNumber,
      user
    });

    await newReservation.save();

    res.status(201).json({
      success: true,
      message: 'Reserva exitosa'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
  