import mongoose from "mongoose";

const TrucoPartidaSchema =
  new mongoose.Schema({

    equipoA: {
      type: [String],
      default: []
    },

    equipoB: {
      type: [String],
      default: []
    },

    puntosA: {
      type: Number,
      required: true
    },

    puntosB: {
      type: Number,
      required: true
    },

    modo: {
      type: Number,
      enum: [15, 30],
      required: true
    },

    ganador: {
      type: String,
      enum: ["A", "B"],
      required: true
    }

  }, {
    timestamps: true
  });

export default mongoose.model(
  "TrucoPartida",
  TrucoPartidaSchema
);