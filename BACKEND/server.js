import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import reservationRoutes from './routes/reservations.js';
import dotenv from 'dotenv';
import path from 'path';
import footballReservationsRoutes from './routes/footballReservations.js';

import metasAuthRoutes from './routes/metasAuth.js';

import metasObjectivesRoutes from './routes/metasObjectives.js';
import metasRecordsRoutes from './routes/metasRecords.js';
import metasDashboardRoutes from './routes/metasDashboard.js';

import trucoRoutes from './routes/truco.routes.js';
// Importar __dirname en ES module
const __dirname = path.resolve();

// Configuración de dotenv
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Rutas de la API
app.use('/api/reservations', reservationRoutes);
app.use('/api/football-reservations', footballReservationsRoutes);

// metas 
app.use('/api/metas/auth', metasAuthRoutes);
app.use('/api/metas/objetivos', metasObjectivesRoutes);
app.use('/api/metas/registros', metasRecordsRoutes);
app.use('/api/metas/dashboard', metasDashboardRoutes);




// Si se define SERVE_FRONTEND, servir archivos estáticos
if (process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


app.use('/api/truco', trucoRoutes);

// Error handling global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔥 MongoDB conectado');
  } catch (err) {
    console.error('❌ Error al conectar MongoDB:', err.message);
    process.exit(1);
  }
};

// Arrancar servidor
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5075;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();
