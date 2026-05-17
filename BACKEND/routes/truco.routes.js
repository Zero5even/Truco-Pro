import express from "express";

import {
  crearPartida,
  obtenerPartidas,
  eliminarPartida,
  obtenerStats,
  obtenerRanking,
  obtenerJugadores,
  crearJugador,
  eliminarJugador,
  limpiarHistorial
} from "../controllers/truco.controller.js";

const router = express.Router();

/* JUGADORES */
router.get("/jugadores", obtenerJugadores);
router.post("/jugadores", crearJugador);
router.delete("/jugadores/:id", eliminarJugador);

/* CREAR PARTIDA */
router.post("/", crearPartida);

/* HISTORIAL */
router.get("/", obtenerPartidas);

/* STATS */
router.get("/stats", obtenerStats);

/* RANKING */
router.get("/ranking", obtenerRanking);

/* DELETE */
router.delete("/limpiar-todo", limpiarHistorial);
router.delete("/:id", eliminarPartida);


export default router;