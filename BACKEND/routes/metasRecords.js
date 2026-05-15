import express from 'express';
import {
  getTodayRecords,
  saveRecord
} from '../controllers/metasRecords.controller.js';
import metasAuth from '../middlewares/metasAuth.middleware.js';

const router = express.Router();

// 👇 usar el default export
router.use(metasAuth);

router.get('/hoy', getTodayRecords);
router.post('/', saveRecord);

export default router;
