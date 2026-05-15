import mongoose from 'mongoose';

const footballReservationSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true }, // HH:mm
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const FootballReservation = mongoose.model('FootballReservation', footballReservationSchema);
export default FootballReservation;
