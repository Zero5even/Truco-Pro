// controllers/metasObjectives.controller.js

import MetaObjective from '../models/MetaObjective.js';

export const getObjectives = async (req, res) => {
  try {
    const objetivos = await MetaObjective.find({
      userId: req.user.userId,
      activo: true
    });

    res.json(objetivos);
  } catch (error) {
    console.error('GET OBJECTIVES ERROR:', error);
    res.status(500).json({ message: 'Error al obtener objetivos' });
  }
};

export const createObjective = async (req, res) => {
  try {
    const { nombre, categoria, impacto, esfuerzo } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del objetivo es obligatorio' });
    }

    if (!impacto || !esfuerzo) {
      return res
        .status(400)
        .json({ message: 'Impacto y esfuerzo son obligatorios' });
    }

    const objetivo = await MetaObjective.create({
      userId: req.user.userId,
      nombre,
      categoria: categoria || '',
      impacto: impacto ?? 5,
      esfuerzo: esfuerzo ?? 5
    });

    res.status(201).json(objetivo);
  } catch (error) {
    console.error('CREATE OBJECTIVE ERROR:', error);
    res.status(500).json({ message: 'Error al crear objetivo' });
  }
};

export const updateObjective = async (req, res) => {
  try {
    const { id } = req.params;

    const objetivo = await MetaObjective.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!objetivo) {
      return res.status(404).json({ message: 'Objetivo no encontrado' });
    }

    res.json(objetivo);
  } catch (error) {
    console.error('UPDATE OBJECTIVE ERROR:', error);
    res.status(500).json({ message: 'Error al actualizar objetivo' });
  }
};

export const deleteObjective = async (req, res) => {
  try {
    const { id } = req.params;

    const objetivo = await MetaObjective.findOneAndDelete({
      _id: id,
      userId: req.user.userId
    });

    if (!objetivo) {
      return res.status(404).json({ message: 'Objetivo no encontrado' });
    }

    res.json({ message: 'Objetivo eliminado' });
  } catch (error) {
    console.error('DELETE OBJECTIVE ERROR:', error);
    res.status(500).json({ message: 'Error al eliminar objetivo' });
  }
};
