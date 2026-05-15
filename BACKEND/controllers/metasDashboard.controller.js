import MetaDailyRecord from '../models/MetaDailyRecord.js';

export const getDashboard = async (req, res) => {
  const userId = req.user.userId;

  const records = await MetaDailyRecord.find({ userId }) || [];

  const total = records.length;

  const hechos = records.filter(r => r.estado === 'hecho').length;
  const parciales = records.filter(r => r.estado === 'parcial').length;

  const eficiencia =
    total === 0 ? 0 : ((hechos + parciales * 0.5) / total) * 100;

  res.json({
    totalRegistros: total,
    eficiencia: Number(eficiencia.toFixed(2))
  });
};
