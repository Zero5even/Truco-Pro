import mongoose from 'mongoose';

const metaDailyRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UsersMetas',
    required: true
  },
  objetivoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MetaObjective',
    required: true
  },
  fecha: {
    type: String, // YYYY-MM-DD
    required: true
  },
  estado: {
    type: String,
    enum: ['hecho', 'parcial', 'no_hecho'],
    required: true
  }
});

metaDailyRecordSchema.index(
  { userId: 1, objetivoId: 1, fecha: 1 },
  { unique: true }
);

export default mongoose.model('MetaDailyRecord', metaDailyRecordSchema);
