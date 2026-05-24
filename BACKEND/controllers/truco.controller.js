import TrucoPartida from "../models/TrucoPartida.js";
import TrucoPlayer from "../models/TrucoPlayer.js";

/* CREAR */

export const crearPartida =
  async (req, res) => {

    try {

      const partida =
        await TrucoPartida.create(
          req.body
        );

      res.status(201).json(
        partida
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          "Error guardando partida"
      });
    }
  };

/* HISTORIAL */

export const obtenerPartidas =
  async (req, res) => {

    try {

      const partidas =
        await TrucoPartida
          .find()
          .sort({
            createdAt: -1
          });

      res.json(partidas);

    } catch (error) {

      res.status(500).json({
        error:
          "Error obteniendo historial"
      });
    }
  };

/* BORRAR */

export const eliminarPartida =
  async (req, res) => {

    try {

      await TrucoPartida
        .findByIdAndDelete(
          req.params.id
        );

      res.json({
        ok: true
      });

    } catch (error) {

      res.status(500).json({
        error:
          "Error eliminando partida"
      });
    }
  };

export const limpiarHistorial = async (req, res) => {
  try {
    await TrucoPartida.deleteMany({});
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error limpiando historial" });
  }
};


/* STATS */

export const obtenerStats =
  async (req, res) => {

    try {

      const partidas =
        await TrucoPartida.find();

      const stats = {

        total:
          partidas.length,

        ganoA:
          partidas.filter(
            p => p.ganador === "A"
          ).length,

        ganoB:
          partidas.filter(
            p => p.ganador === "B"
          ).length
      };

      res.json(stats);

    } catch (error) {

      res.status(500).json({
        error:
          "Error obteniendo stats"
      });
    }
  };

/* RANKING */

export const obtenerRanking = async (req, res) => {
  try {
    const partidas = await TrucoPartida.find();
    const jugadoresDB = await TrucoPlayer.find();

    const rankingJugadores = {};

    jugadoresDB.forEach(jug => {
      if (!jug || !jug.nombre) return;
      const nombre = jug.nombre.trim().toUpperCase();
      rankingJugadores[nombre] = {
        nombre: nombre,
        partidasJugadas: 0,
        victorias: 0,
        winrate: 0
      };
    });

    partidas.forEach(partida => {
      const ganadores = partida.ganador === "A" ? (partida.equipoA || []) : (partida.equipoB || []);
      const perdedores = partida.ganador === "A" ? (partida.equipoB || []) : (partida.equipoA || []);

      ganadores.forEach(jug => {
        if (!jug) return;
        const nombre = jug.trim().toUpperCase();
        if (!rankingJugadores[nombre]) {
          rankingJugadores[nombre] = { nombre, partidasJugadas: 0, victorias: 0, winrate: 0 };
        }
        rankingJugadores[nombre].partidasJugadas++;
        rankingJugadores[nombre].victorias++;
      });

      perdedores.forEach(jug => {
        if (!jug) return;
        const nombre = jug.trim().toUpperCase();
        if (!rankingJugadores[nombre]) {
          rankingJugadores[nombre] = { nombre, partidasJugadas: 0, victorias: 0, winrate: 0 };
        }
        rankingJugadores[nombre].partidasJugadas++;
      });
    });

    Object.values(rankingJugadores).forEach(jug => {
      if (jug.partidasJugadas > 0) {
        jug.winrate = Math.round((jug.victorias / jug.partidasJugadas) * 100);
        // Bayesian Average Score: (victorias + 2) / (partidasJugadas + 4) * 100
        jug.score = Math.round(((jug.victorias + 2) / (jug.partidasJugadas + 4)) * 100 * 10) / 10;
      } else {
        jug.winrate = 0;
        jug.score = 50.0;
      }
    });

    const jugadoresConPartidas = Object.values(rankingJugadores).filter(jug => jug.partidasJugadas > 0);

    const jugadoresOrdenados = jugadoresConPartidas.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.winrate !== a.winrate) {
        return b.winrate - a.winrate;
      }
      return b.partidasJugadas - a.partidasJugadas;
    });

    res.json({
      jugadores: jugadoresOrdenados
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error calculando ranking" });
  }
};

/* JUGADORES */

export const obtenerJugadores = async (req, res) => {
  try {
    const jugadores = await TrucoPlayer.find().sort({ nombre: 1 });
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo jugadores" });
  }
};

export const crearJugador = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });
    
    const nuevoJugador = await TrucoPlayer.create({ nombre });
    res.status(201).json(nuevoJugador);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "El jugador ya existe" });
    }
    res.status(500).json({ error: "Error creando jugador" });
  }
};

export const eliminarJugador = async (req, res) => {
  try {
    await TrucoPlayer.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando jugador" });
  }
};