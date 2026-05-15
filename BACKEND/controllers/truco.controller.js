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

export const obtenerRanking =
  async (req, res) => {

    try {

      const partidas =
        await TrucoPartida.find();

      const rankingJugadores = {};

      const rankingParejas = {};

      partidas.forEach(partida => {

        const ganadores =
          partida.ganador === "A"
            ? partida.equipoA
            : partida.equipoB;

        /* JUGADORES */

        ganadores.forEach(jugador => {

          if (!rankingJugadores[jugador]) {

            rankingJugadores[jugador] = 0;
          }

          rankingJugadores[jugador]++;
        });

        /* PAREJAS */

        const pareja =
          [...ganadores]
            .sort()
            .join(" & ");

        if (!rankingParejas[pareja]) {

          rankingParejas[pareja] = 0;
        }

        rankingParejas[pareja]++;
      });

      const jugadoresOrdenados =
        Object.entries(
          rankingJugadores
        )
        .sort((a, b) => b[1] - a[1]);

      const parejasOrdenadas =
        Object.entries(
          rankingParejas
        )
        .sort((a, b) => b[1] - a[1]);

      res.json({

        jugadores:
          jugadoresOrdenados,

        parejas:
          parejasOrdenadas
      });

    } catch (error) {

      res.status(500).json({
        error:
          "Error ranking"
      });
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