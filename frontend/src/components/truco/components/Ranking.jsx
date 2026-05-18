import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerRanking, obtenerHistorial, borrarPartida } from "../services/trucoApi";
import "../styles/truco.css";
import "../styles/ranking.css";

export default function Ranking() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    document.body.classList.add("fondo-madera");
    cargarDatos();
    return () => document.body.classList.remove("fondo-madera");
  }, []);

  const calcularRankingEnCliente = (partidas, rankingBackend) => {
    const mapJugadores = {};
    const mapParejas = {};

    if (rankingBackend && rankingBackend.jugadores) {
      rankingBackend.jugadores.forEach(j => {
        if (j && j.nombre) {
          const nom = j.nombre.trim().toUpperCase();
          mapJugadores[nom] = { nombre: nom, partidasJugadas: 0, victorias: 0, winrate: 0 };
        }
      });
    }

    partidas.forEach(p => {
      const ganoA = p.ganador === "A";
      const ganadores = (ganoA ? p.equipoA : p.equipoB) || [];
      const perdedores = (ganoA ? p.equipoB : p.equipoA) || [];

      // Ranking individual
      ganadores.forEach(jug => {
        if (!jug) return;
        const nom = jug.trim().toUpperCase();
        if (!mapJugadores[nom]) {
          mapJugadores[nom] = { nombre: nom, partidasJugadas: 0, victorias: 0, winrate: 0 };
        }
        mapJugadores[nom].partidasJugadas++;
        mapJugadores[nom].victorias++;
      });

      perdedores.forEach(jug => {
        if (!jug) return;
        const nom = jug.trim().toUpperCase();
        if (!mapJugadores[nom]) {
          mapJugadores[nom] = { nombre: nom, partidasJugadas: 0, victorias: 0, winrate: 0 };
        }
        mapJugadores[nom].partidasJugadas++;
      });

      // Ranking por parejas (2v2)
      if (p.equipoA && p.equipoA.length === 2 && p.equipoB && p.equipoB.length === 2) {
        // Ganadores pareja
        const g1 = ganadores[0]?.trim();
        const g2 = ganadores[1]?.trim();
        if (g1 && g2) {
          const keyUpper = [g1.toUpperCase(), g2.toUpperCase()].sort().join(" & ");
          const display = [g1, g2].sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase())).join(" & ");
          if (!mapParejas[keyUpper]) {
            mapParejas[keyUpper] = { nombre: display, partidasJugadas: 0, victorias: 0, winrate: 0 };
          }
          mapParejas[keyUpper].partidasJugadas++;
          mapParejas[keyUpper].victorias++;
        }

        // Perdedores pareja
        const per1 = perdedores[0]?.trim();
        const per2 = perdedores[1]?.trim();
        if (per1 && per2) {
          const keyUpper = [per1.toUpperCase(), per2.toUpperCase()].sort().join(" & ");
          const display = [per1, per2].sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase())).join(" & ");
          if (!mapParejas[keyUpper]) {
            mapParejas[keyUpper] = { nombre: display, partidasJugadas: 0, victorias: 0, winrate: 0 };
          }
          mapParejas[keyUpper].partidasJugadas++;
        }
      }
    });

    Object.values(mapJugadores).forEach(j => {
      if (j.partidasJugadas > 0) {
        j.winrate = Math.round((j.victorias / j.partidasJugadas) * 100);
      } else {
        j.winrate = 0;
      }
    });

    Object.values(mapParejas).forEach(par => {
      if (par.partidasJugadas > 0) {
        par.winrate = Math.round((par.victorias / par.partidasJugadas) * 100);
      } else {
        par.winrate = 0;
      }
    });

    const ordenadosJugadores = Object.values(mapJugadores).sort((a, b) => {
      if (b.winrate !== a.winrate) return b.winrate - a.winrate;
      return b.partidasJugadas - a.partidasJugadas;
    });

    const ordenadosParejas = Object.values(mapParejas).sort((a, b) => {
      if (b.winrate !== a.winrate) return b.winrate - a.winrate;
      return b.partidasJugadas - a.partidasJugadas;
    });

    return { jugadores: ordenadosJugadores, parejas: ordenadosParejas };
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const resRanking = await obtenerRanking();
      const resHistorial = await obtenerHistorial();
      
      const ordenadoHistorial = resHistorial.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistorial(ordenadoHistorial);

      const rankingConsistente = calcularRankingEnCliente(ordenadoHistorial, resRanking.data);
      setRanking(rankingConsistente);
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

  const formatearFecha = (isoString) => {
    const fecha = new Date(isoString);
    return fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="truco-app rankings-page-container">
      {/* TOP MENU BOTON */}
      <button className="menu-btn top-right-menu-btn" onClick={() => setShowMenu(true)} title="Menú de Ajustes">
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* SIDE MENU DRAWER */}
      <div 
        className={`side-menu-overlay ${showMenu ? 'show' : ''}`} 
        onClick={() => setShowMenu(false)}
      ></div>
      <div className={`side-menu-drawer ${showMenu ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 className="title-serif">Ajustes</h2>
          <button className="close-drawer" onClick={() => setShowMenu(false)}>✕</button>
        </div>
        <div className="drawer-content">
          <button className="home-menu-btn font-weight-bold" onClick={() => { setShowMenu(false); navigate("/truco"); }}>
            🏠 Inicio / Home
          </button>
          <button className="ranking-menu-btn font-weight-bold" onClick={() => { setShowMenu(false); navigate("/truco/rankings"); }}>
            🏆 Rankings e Historial
          </button>
        </div>
      </div>

      <div className="rankings-content">
        
        {/* BOTON VOLVER ARRIBA DE TODO, CON EL MISMO ANCHO DE LAS TABLAS */}
        <button className="btn-volver-top font-weight-bold" onClick={() => navigate("/truco")}>
          ⬅️ Volver
        </button>

        <h1 className="title-serif text-center mb-4 text-glow mt-3" style={{ color: "#ffdd57" }}>Estadísticas e Historial</h1>
        
        {loading ? (
          <div className="loading-box">Cargando estadísticas...</div>
        ) : (
          <div className="rankings-layout-vertical">
            
            {/* PANEL RANKING JUGADORES */}
            <div className="ranking-panel">
              <div className="panel-header-flex">
                <h2>🏆 Ranking</h2>
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

            {/* PANEL PAREJAS IDEALES */}
            <div className="ranking-panel">
              <div className="panel-header-flex">
                <h2>🤝 Parejas ideales</h2>
                <span className="badge-count">{ranking?.parejas?.length || 0} Parejas</span>
              </div>
              
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Pareja</th>
                      <th>Winrate</th>
                      <th>PJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!ranking?.parejas || ranking.parejas.length === 0) ? (
                      <tr>
                        <td colSpan="4" className="text-center empty-msg">No hay parejas de 2v2 registradas aún.</td>
                      </tr>
                    ) : (
                      ranking.parejas.map((par, i) => {
                        let badgeClass = "badge-silver";
                        if (i === 0 && par.partidasJugadas > 0) badgeClass = "badge-gold";
                        if (i === 1 && par.partidasJugadas > 0) badgeClass = "badge-silver";
                        if (i === 2 && par.partidasJugadas > 0) badgeClass = "badge-bronze";
                        
                        return (
                          <tr key={par.nombre} className={i < 3 && par.partidasJugadas > 0 ? "top-row" : ""}>
                            <td className="pos-cell font-weight-bold">#{i + 1}</td>
                            <td className="name-cell font-weight-bold">{par.nombre}</td>
                            <td className="winrate-cell">
                              <span className={`winrate-badge ${badgeClass}`}>
                                {par.partidasJugadas > 0 ? `${par.winrate}%` : "-"}
                              </span>
                            </td>
                            <td className="pj-cell">{par.partidasJugadas}</td>
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
                <h2>📜 Historial</h2>
                <span className="badge-count">{historial.length} Partidos</span>
              </div>

              <div className="historial-list-compact">
                {historial.length === 0 ? (
                  <p className="text-center empty-msg">No hay partidos jugados aún. ¡Anoten el primero!</p>
                ) : (
                  historial.map((part) => {
                    const ganoA = part.ganador === "A";
                    return (
                      <div key={part._id} className="historial-card-modern">
                        <div className="hist-card-top">
                          <div className="hist-meta">
                            <span className="hist-mod font-weight-bold">🎲 {part.modalidad || "Parejas"} (a {part.modo} pts)</span>
                            <span className={`hist-flor-tag ${part.conFlor ? "flor-yes" : "flor-no"}`}>
                              {part.conFlor ? "🌸 Flor" : "❌ Sin Flor"}
                            </span>
                            <span className="hist-date">📅 {formatearFecha(part.createdAt)}</span>
                          </div>

                          <div className="hist-match">
                            <div className={`hist-team-box ${ganoA ? 'winner-box' : 'loser-box'}`}>
                              <span className="hist-name">{part.equipoA.join(" & ")}</span>
                              <span className="hist-pts font-weight-bold">{part.puntosA}</span>
                              {ganoA && <span className="crown font-weight-bold" title="Ganador">👑</span>}
                            </div>
                            <span className="hist-vs font-italic font-weight-bold">vs</span>
                            <div className={`hist-team-box ${!ganoA ? 'winner-box' : 'loser-box'}`}>
                              <span className="hist-name">{part.equipoB.join(" & ")}</span>
                              <span className="hist-pts font-weight-bold">{part.puntosB}</span>
                              {!ganoA && <span className="crown font-weight-bold" title="Ganador">👑</span>}
                            </div>
                          </div>
                        </div>

                        <div className="hist-card-bottom">
                          <button 
                            className="btn-delete-full font-weight-bold" 
                            onClick={() => handleBorrarPartida(part._id)}
                            title="Eliminar este partido del registro"
                          >
                            🗑️ Eliminar
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