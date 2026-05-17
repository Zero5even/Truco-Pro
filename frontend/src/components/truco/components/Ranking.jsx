// Ranking.jsx – actualizado para winrate y historial
import { useEffect, useState } from "react";
import { obtenerRanking, obtenerHistorial, borrarPartida } from "../services/trucoApi";
import "../styles/ranking.css";

export default function Ranking() {
  // Rankings de jugadores
  const [ranking, setRanking] = useState(null);
  const [expandJugadores, setExpandJugadores] = useState(false);

  // Historial de partidas
  const [historial, setHistorial] = useState([]);
  const [expandHistorial, setExpandHistorial] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    cargarRanking();
    cargarHistorial();
  }, []);

  const cargarRanking = async () => {
    try {
      const res = await obtenerRanking();
      setRanking(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const cargarHistorial = async () => {
    try {
      const res = await obtenerHistorial();
      const ordenado = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistorial(ordenado);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBorrar = async (id) => {
    if (!window.confirm("¿Eliminar esta partida? Esta acción no se puede deshacer.")) return;
    try {
      await borrarPartida(id);
      cargarRanking();
      cargarHistorial();
    } catch (e) {
      console.error(e);
    }
  };

  if (!ranking) {
    return (
      <div className="ranking-panel">Cargando ranking...</div>
    );
  }

  const jugadoresMostrar = expandJugadores ? ranking.jugadores : ranking.jugadores.slice(0, 5);
  const historialMostrar = expandHistorial ? historial : historial.slice(0, 5);

  return (
    <div className="ranking-wrapper">
      {/* Jugadores */}
      <div className="ranking-panel">
        <h2>🏆 Jugadores</h2>
        {jugadoresMostrar.map((jug, i) => (
          <div key={i} className="ranking-item">
            <span className="ranking-name">#{i + 1} {jug.nombre}</span>
            <span className="ranking-stats">
              {jug.winrate}% winrate • {jug.partidasJugadas} PJ
            </span>
          </div>
        ))}
        {ranking.jugadores.length > 5 && (
          <button className="ranking-expand" onClick={() => setExpandJugadores(!expandJugadores)}>
            {expandJugadores ? "Ver menos ▲" : "Ver más ▼"}
          </button>
        )}
      </div>

      {/* Historial */}
      <div className="ranking-panel">
        <h2>📜 Historial de Partidas</h2>
        {historialMostrar.map((part, i) => (
          <div key={i} className="ranking-item">
            <span className="ranking-name">
              {new Date(part.createdAt).toLocaleDateString()} – {part.modalidad || "Desconocida"} – {part.modo} pts
              {part.conFlor && " – 🌸 Flor"}
            </span>
            <span className="ranking-stats">
              {part.equipoA.join(" & ")} ({part.puntosA}) vs {part.equipoB.join(" & ")} ({part.puntosB})
            </span>
            <button className="danger" onClick={() => handleBorrar(part._id)} title="Eliminar partida">🗑️</button>
          </div>
        ))}
        {historial.length > 5 && (
          <button className="ranking-expand" onClick={() => setExpandHistorial(!expandHistorial)}>
            {expandHistorial ? "Ver menos ▲" : "Ver más ▼"}
          </button>
        )}
      </div>
    </div>
  );
}