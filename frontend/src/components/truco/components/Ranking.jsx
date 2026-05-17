import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerRanking, obtenerHistorial, borrarPartida, limpiarTodoHistorial } from "../services/trucoApi";
import logo from "../../../assets/logo_falta_envido.png";
import "../styles/truco.css";
import "../styles/ranking.css";

export default function Ranking() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("fondo-madera");
    cargarDatos();
    return () => document.body.classList.remove("fondo-madera");
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const resRanking = await obtenerRanking();
      const resHistorial = await obtenerHistorial();
      setRanking(resRanking.data);
      const ordenado = resHistorial.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistorial(ordenado);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrarPartida = async (id) => {
    if (!window.confirm("⚠️ ¿Estás seguro de eliminar este partido? Los rankings se recalcularán.")) return;
    try {
      await borrarPartida(id);
      cargarDatos();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLimpiarTodo = async () => {
    if (!window.confirm("🚨 ¡ATENCIÓN! ¿Estás seguro de que deseas eliminar TODO el historial de partidas? Todos los jugadores volverán a tener 0 partidos jugados y 0% de winrate. Esta acción no se puede deshacer.")) return;
    try {
      await limpiarTodoHistorial();
      cargarDatos();
    } catch (e) {
      console.error(e);
    }
  };

  const formatearFecha = (isoString) => {
    const fecha = new Date(isoString);
    return fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="truco-app rankings-page-container">
      <div className="header-container rankings-header">
        <button className="back-btn" onClick={() => navigate("/truco")}>
          ⬅️ Volver
        </button>
        <img src={logo} className="app-logo-small" alt="Falta Envido" />
        <button className="clean-all-btn" onClick={handleLimpiarTodo} title="Reiniciar Historial de Partidas">
          🧹 Limpiar Todo
        </button>
      </div>

      <div className="rankings-content">
        <h1 className="title-serif text-center mb-4 text-glow" style={{ color: "#ffdd57" }}>Estadísticas e Historial</h1>
        
        {loading ? (
          <div className="loading-box">Cargando estadísticas...</div>
        ) : (
          <div className="rankings-layout-vertical">
            
            {/* PANEL RANKING JUGADORES */}
            <div className="ranking-panel">
              <div className="panel-header-flex">
                <h2>🏆 Ranking por Winrate</h2>
                <span className="badge-count">{ranking?.jugadores?.length || 0} Jugadores</span>
              </div>
              
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Jugador</th>
                      <th>Winrate</th>
                      <th>PJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!ranking?.jugadores || ranking.jugadores.length === 0) ? (
                      <tr>
                        <td colSpan="4" className="text-center empty-msg">No hay jugadores registrados.</td>
                      </tr>
                    ) : (
                      ranking.jugadores.map((jug, i) => {
                        let badgeClass = "badge-silver";
                        if (i === 0 && jug.partidasJugadas > 0) badgeClass = "badge-gold";
                        if (i === 1 && jug.partidasJugadas > 0) badgeClass = "badge-silver";
                        if (i === 2 && jug.partidasJugadas > 0) badgeClass = "badge-bronze";
                        
                        return (
                          <tr key={jug.nombre} className={i < 3 && jug.partidasJugadas > 0 ? "top-row" : ""}>
                            <td className="pos-cell font-weight-bold">#{i + 1}</td>
                            <td className="name-cell font-weight-bold">{jug.nombre}</td>
                            <td className="winrate-cell">
                              <span className={`winrate-badge ${badgeClass}`}>
                                {jug.partidasJugadas > 0 ? `${jug.winrate}%` : "-"}
                              </span>
                            </td>
                            <td className="pj-cell">{jug.partidasJugadas}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PANEL HISTORIAL DE PARTIDAS */}
            <div className="ranking-panel">
              <div className="panel-header-flex">
                <h2>📜 Historial de Partidas</h2>
                <span className="badge-count">{historial.length} Partidos</span>
              </div>

              <div className="historial-list-compact">
                {historial.length === 0 ? (
                  <p className="text-center empty-msg">No hay partidos jugados aún. ¡Anoten el primero!</p>
                ) : (
                  historial.map((part) => {
                    const ganoA = part.ganador === "A";
                    return (
                      <div key={part._id} className="historial-item-compact">
                        <div className="hist-meta-col">
                          <div className="hist-modalidad">
                            🎲 <strong style={{ color: "#ffdd57" }}>{part.modalidad || "Parejas"}</strong>
                            <span className="hist-badge-pts">a {part.modo} pts</span>
                            <span className={`hist-badge-flor ${part.conFlor ? "flor-yes" : "flor-no"}`}>
                              {part.conFlor ? "🌸 Flor" : "❌ Sin Flor"}
                            </span>
                          </div>
                          <div className="hist-submeta">
                            📅 {formatearFecha(part.createdAt)}
                          </div>
                        </div>

                        <div className="hist-match-col">
                          <div className={`hist-team ${ganoA ? 'hist-winner' : 'hist-loser'}`}>
                            <span className="hist-team-name">{part.equipoA.join(" & ")}</span>
                            <span className="hist-team-score font-weight-bold">{part.puntosA}</span>
                            {ganoA && <span className="hist-crown" title="Ganador">👑</span>}
                          </div>

                          <span className="hist-vs font-italic">vs</span>

                          <div className={`hist-team ${!ganoA ? 'hist-winner' : 'hist-loser'}`}>
                            <span className="hist-team-name">{part.equipoB.join(" & ")}</span>
                            <span className="hist-team-score font-weight-bold">{part.puntosB}</span>
                            {!ganoA && <span className="hist-crown" title="Ganador">👑</span>}
                          </div>
                        </div>

                        <div className="hist-actions-col">
                          <button 
                            className="btn-trash-compact" 
                            onClick={() => handleBorrarPartida(part._id)}
                            title="Eliminar este partido"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}