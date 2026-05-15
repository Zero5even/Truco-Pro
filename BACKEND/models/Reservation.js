// models/Reservation.js
import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  date: { type: String, required: true },        // <--- ahora es string YYYY-MM-DD
  shift: { type: String, enum: ['dia', 'noche'], required: true },
  grillNumber: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
