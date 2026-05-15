// controllers/metasRecords.controller.js

import MetaDailyRecord from '../models/MetaDailyRecord.js';

export const getTodayRecords = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const records = await MetaDailyRecord.find({
      userId: req.user.userId,
      fecha: today
    });

    res.json(records);
  } catch (error) {
    console.error('GET TODAY RECORDS ERROR:', error);
    res.status(500).json({ message: 'Error al obtener registros' });
  }
};

export const saveRecord = async (req, res) => {
  try {
    const { objetivoId, estado, fecha } = req.body;

    if (!objetivoId || !estado) {
      return res.status(400).json({ message: 'objetivoId y estado son obligatorios' });
    }

    const fechaRegistro = fecha || new Date().toISOString().slice(0, 10);

    const record = await MetaDailyRecord.findOneAndUpdate(
      {
        userId: req.user.userId,
        objetivoId,
        fecha: fechaRegistro
      },
      { estado },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    console.error('SAVE RECORD ERROR:', error);
    res.status(500).json({ message: 'Error al guardar registro' });
  }
};
