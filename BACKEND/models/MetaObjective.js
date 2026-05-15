import mongoose from 'mongoose';

const metaObjectiveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UsersMetas',
      required: true,
    },

    nombre: {
      type: String,
      required: true,
    },

    categoria: {
      type: String,
      default: '',
    },

    impacto: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    esfuerzo: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * 🔥 Índice Esfuerzo vs Recompensa
 * Prioridad = Impacto / Esfuerzo
 */
metaObjectiveSchema.virtual('prioridad').get(function () {
  if (!this.esfuerzo || this.esfuerzo === 0) return 0;
  return Number((this.impacto / this.esfuerzo).toFixed(2));
});

// habilitar virtuals
metaObjectiveSchema.set('toJSON', { virtuals: true });
metaObjectiveSchema.set('toObject', { virtuals: true });

export default mongoose.model('MetaObjective', metaObjectiveSchema);
