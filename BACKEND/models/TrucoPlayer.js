import mongoose from "mongoose";

const trucoPlayerSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("TrucoPlayer", trucoPlayerSchema);
