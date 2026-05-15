import express from 'express';
import {
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjective
} from '../controllers/metasObjectives.controller.js';

// ✅ IMPORTAR EL MIDDLEWARE DE AUTENTICACIÓN
import authMiddleware from '../middlewares/metasAuth.middleware.js';

const router = express.Router();

// Rutas de objetivos
router.get('/', authMiddleware, getObjectives);
router.post('/', authMiddleware, createObjective);
router.put('/:id', authMiddleware, updateObjective);
router.delete('/:id', authMiddleware, deleteObjective);

export default router;
