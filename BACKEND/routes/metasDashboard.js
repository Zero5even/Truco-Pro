import express from 'express';
import { getDashboard } from '../controllers/metasDashboard.controller.js';
import metasAuth from '../middlewares/metasAuth.middleware.js';
const router = express.Router();

// 👇 usar el default export
router.use(metasAuth);

router.get('/', getDashboard);

export default router;
