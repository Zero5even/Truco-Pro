import {
  useEffect,
  useState
} from "react";

import {
  obtenerRanking
} from "../services/trucoApi";

import "../styles/ranking.css";

export default function Ranking() {

  const [ranking, setRanking] =
    useState(null);

  const [expandJugadores,
    setExpandJugadores] =
      useState(false);

  const [expandParejas,
    setExpandParejas] =
      useState(false);

  useEffect(() => {

    cargarRanking();

  }, []);

  const cargarRanking =
    async () => {

      try {

        const res =
          await obtenerRanking();

        setRanking(res.data);

      } catch (error) {

        console.error(error);
      }
    };

  if (!ranking) {

    return (
      <div className="ranking-panel">
        Cargando ranking...
      </div>
    );
  }

  const jugadoresMostrar =
    expandJugadores
      ? ranking.jugadores
      : ranking.jugadores.slice(0, 0);

  const parejasMostrar =
    expandParejas
      ? ranking.parejas
      : ranking.parejas.slice(0, 0);

  return (
    <div className="ranking-wrapper">

      {/* JUGADORES */}

      <div className="ranking-panel">

        <h2>
          🏆 Jugadores
        </h2>

        {jugadoresMostrar.map(
          ([nombre, wins], i) => (

            <div
              key={i}
              className="ranking-item"
            >

              <span
                className="ranking-name"
              >
                #{i + 1} {nombre}
              </span>

              <strong>
                {wins} wins
              </strong>

            </div>
          )
        )}

        {ranking.jugadores.length > 3 && (

          <button
            className="ranking-expand"
            onClick={() =>
              setExpandJugadores(
                !expandJugadores
              )
            }
          >
            {expandJugadores
              ? "Ver menos ▲"
              : "Ver más ▼"}
          </button>
        )}

      </div>

      {/* PAREJAS */}

      <div className="ranking-panel">

        <h2>
          🤝 Parejas
        </h2>

        {parejasMostrar.map(
          ([pareja, wins], i) => (

            <div
              key={i}
              className="ranking-item"
            >

              <span
                className="ranking-name"
              >
                #{i + 1} {pareja}
              </span>

              <strong>
                {wins} wins
              </strong>

            </div>
          )
        )}

        {ranking.parejas.length > 3 && (

          <button
            className="ranking-expand"
            onClick={() =>
              setExpandParejas(
                !expandParejas
              )
            }
          >
            {expandParejas
              ? "Ver menos ▲"
              : "Ver más ▼"}
          </button>
        )}

      </div>

    </div>
  );
}