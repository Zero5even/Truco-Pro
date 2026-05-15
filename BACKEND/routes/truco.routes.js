import express from "express";

import {
  crearPartida,
  obtenerPartidas,
  eliminarPartida,
  obtenerStats,
  obtenerRanking,
  obtenerJugadores,
  crearJugador,
  eliminarJugador
} from "../controllers/truco.controller.js";

const router = express.Router();

/* CREAR */

router.post(
  "/",
  crearPartida
);

/* HISTORIAL */

router.get(
  "/",
  obtenerPartidas
);

/* STATS */

router.get(
  "/stats",
  obtenerStats
);

/* RANKING */

router.get(
  "/ranking",
  obtenerRanking
);

/* DELETE */

router.delete(
  "/:id",
  eliminarPartida
);

/* JUGADORES */

router.get("/jugadores", obtenerJugadores);
router.post("/jugadores", crearJugador);
router.delete("/jugadores/:id", eliminarJugador);

export default router;