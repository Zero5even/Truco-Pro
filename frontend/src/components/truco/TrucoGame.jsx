import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfettiExplosion from "react-confetti-explosion";
import PlayerManager from "./components/PlayerManager";
import GameConfig from "./components/GameConfig";
import SorteoReyes from "./components/SorteoReyes";
import AnotadorClasico from "./components/AnotadorClasico";
import { guardarPartida } from "./services/trucoApi";
import logo from "../../assets/logo_falta_envido.png";

import "./styles/truco.css";
import "./styles/ranking.css";

export default function TrucoGame() {
  const navigate = useNavigate();
  const [modo, setModo] = useState(30);
  const [florEnabled, setFlorEnabled] = useState(false);
  const [inputMethod, setInputMethod] = useState("classic");
  const [gameStarted, setGameStarted] = useState(false);
  
  const [jugadores, setJugadores] = useState([]);
  const [equipoA, setEquipoA] = useState([]);
  const [equipoB, setEquipoB] = useState([]);
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [ganadorPartida, setGanadorPartida] = useState(null);
  const [partidaGuardada, setPartidaGuardada] = useState(false);
  
  // Modals state
  const [showPlayers, setShowPlayers] = useState(false);
  const [showSorteo, setShowSorteo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const limite = modo;
  const equiposListos = equipoA.length >= 1 && equipoB.length >= 1; // Para permitir mano a mano si se arma manual
  const partidaTerminada = ganadorPartida !== null;

  /* =========================
     FONDO MADERA
  ========================= */
  useEffect(() => {
    // Añadimos la clase al body para el fondo de madera generado
    document.body.classList.add("fondo-madera");
    return () => document.body.classList.remove("fondo-madera");
  }, []);

  /* =========================
     GANADOR
  ========================= */
  useEffect(() => {
    if (puntosA >= limite && !ganadorPartida) {
      setGanadorPartida("A");
      setShowWinnerModal(true);
    }
    if (puntosB >= limite && !ganadorPartida) {
      setGanadorPartida("B");
      setShowWinnerModal(true);
    }
  }, [puntosA, puntosB, limite, ganadorPartida]);

  /* =========================
     GUARDAR PARTIDA
  ========================= */
  useEffect(() => {
    const guardar = async () => {
      if (!ganadorPartida || partidaGuardada) return;
      try {
        let modalidadCalculada = "Parejas";
        if (equipoA.length === 1 && equipoB.length === 1) {
          modalidadCalculada = "Mano a mano";
        } else if (equipoA.length === 2 && equipoB.length === 2) {
          modalidadCalculada = "Parejas";
        } else if (equipoA.length >= 3 && equipoB.length >= 3) {
          modalidadCalculada = "Pica pica";
        } else {
          modalidadCalculada = `${equipoA.length}v${equipoB.length}`;
        }

        await guardarPartida({
          equipoA,
          equipoB,
          puntosA,
          puntosB,
          modo,
          ganador: ganadorPartida,
          modalidad: modalidadCalculada,
          conFlor: florEnabled,
          diferenciaPuntos: Math.abs(puntosA - puntosB)
        });
        setPartidaGuardada(true);
      } catch (error) {
        console.error(error);
      }
    };
    guardar();
  }, [ganadorPartida, equipoA, equipoB, puntosA, puntosB, modo, partidaGuardada, florEnabled]);

  const nombreGanador = ganadorPartida === "A"
    ? equipoA.join(" & ")
    : ganadorPartida === "B"
      ? equipoB.join(" & ")
      : null;

  /* =========================
     HISTORIAL
  ========================= */
  const guardarEstado = () => {
    setHistorial(prev => [...prev, { puntosA, puntosB }]);
  };

  const deshacer = () => {
    if (historial.length === 0) return;
    const ultimo = historial[historial.length - 1];
    setPuntosA(ultimo.puntosA);
    setPuntosB(ultimo.puntosB);
    setHistorial(prev => prev.slice(0, -1));
  };

  /* =========================
     SUMAR
  ========================= */
  const sumarA = (valor) => {
    if (partidaTerminada || !equiposListos) return;
    guardarEstado();
    setPuntosA(prev => Math.max(0, Math.min(prev + valor, limite)));
  };

  const sumarB = (valor) => {
    if (partidaTerminada || !equiposListos) return;
    guardarEstado();
    setPuntosB(prev => Math.max(0, Math.min(prev + valor, limite)));
  };

  /* =========================
     SORTEO REYES
  ========================= */
  const iniciarSorteo = (jugs) => {
    setJugadores(jugs);
    setShowPlayers(false);
    setShowSorteo(true);
  };

  const onEquiposDefinidos = (teamA, teamB) => {
    setEquipoA(teamA);
    setEquipoB(teamB);
    setShowPlayers(false);
    setShowSorteo(false);
    nuevaPartida(false); 
  };

  /* =========================
     NUEVA PARTIDA
  ========================= */
  const nuevaPartida = (fullReset = true) => {
    if (fullReset && gameStarted) {
      if (!window.confirm("¿Está seguro de que desea reiniciar la partida? Se borrarán los puntos actuales.")) return;
    }
    setPuntosA(0);
    setPuntosB(0);
    setHistorial([]);
    setGanadorPartida(null);
    setShowWinnerModal(false);
    setPartidaGuardada(false);
    if (fullReset) {
      setGameStarted(false);
    }
    setShowMenu(false);
  };

  const faltaEnvidoPuntos = limite - Math.max(puntosA, puntosB);

  return (
    <div className="truco-app">
      <div className="header-container">
        <img src={logo} className="app-logo" alt="Falta Envido" />
        
        {/* TOP MENU BOTON */}
        <button className="menu-btn top-right-menu-btn" onClick={() => setShowMenu(true)} title="Menú de Ajustes">
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

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
          <div className="drawer-divider"></div>
          <button onClick={() => { setInputMethod(inputMethod === "classic" ? "dynamic" : "classic"); setShowMenu(false); }}>
            Cambiar a {inputMethod === "classic" ? "Dinámico" : "Clásico"}
          </button>
          <button onClick={() => { setFlorEnabled(!florEnabled); setShowMenu(false); }}>
            {florEnabled ? "Quitar Flor" : "Habilitar Flor"}
          </button>
          <div className="drawer-divider"></div>
          <button className="danger font-weight-bold" onClick={() => nuevaPartida(true)}>
            Reiniciar Partida
          </button>
        </div>
      </div>

      {/* MODALES */}

      {showPlayers && (
        <div className="players-modal-overlay">
          <div className="players-modal">
            <button className="close-modal" onClick={() => setShowPlayers(false)}>✕</button>
            <PlayerManager
              onSorteo={iniciarSorteo}
              onEquiposDefinidos={onEquiposDefinidos}
            />
          </div>
        </div>
      )}

      {showSorteo && (
        <div className="players-modal-overlay">
          <div className="players-modal">
            <SorteoReyes 
              jugadores={jugadores} 
              onEquiposDefinidos={onEquiposDefinidos}
              onCancel={() => setShowSorteo(false)}
            />
          </div>
        </div>
      )}

      {/* CONFIGURACION ANTES DE JUGAR */}
      {!gameStarted && (
        <>
          <button className="players-toggle" onClick={() => setShowPlayers(true)}>
            👥 Cargar Jugadores
          </button>
          
          <GameConfig 
            modo={modo}
            setModo={setModo}
            florEnabled={florEnabled}
            setFlorEnabled={setFlorEnabled}
            inputMethod={inputMethod}
            setInputMethod={setInputMethod}
            equiposListos={equiposListos}
            onStart={() => setGameStarted(true)}
          />

          {equiposListos && (
            <div className="preview-equipos">
              <h3>Equipos Seleccionados:</h3>
              <p><strong>Equipo 1:</strong> {equipoA.join(" & ")}</p>
              <p><strong>Equipo 2:</strong> {equipoB.join(" & ")}</p>
            </div>
          )}
{/* <Ranking /> */}
        </>
      )}

      {/* JUEGO EN CURSO */}
      {gameStarted && (
        <>
          <div className="top-actions">
            <button className="undo-btn" onClick={deshacer}>
              ↩ Deshacer
            </button>
          </div>

          {showWinnerModal && (
            <div className="winner-modal-overlay" onClick={() => setShowWinnerModal(false)}>
              <div className="winner-modal-content" onClick={(e) => e.stopPropagation()}>
                <ConfettiExplosion force={0.8} duration={3000} particleCount={250} width={1600} />
                <div className="winner-trophy">🏆</div>
                <h2 className="title-serif">¡Ganaron {nombreGanador}!</h2>
                <p>¡Partida terminada!</p>
                <div className="winner-actions-vertical">
                  <button className="revancha-btn" onClick={() => nuevaPartida(false)}>
                    🔄 Revancha
                  </button>
                  <button className="menu-principal-btn" onClick={() => nuevaPartida(true)}>
                    🏠 Menú Principal
                  </button>
                  <button className="ver-puntos-btn" onClick={() => setShowWinnerModal(false)}>
                    Ver Puntos
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="teams-container">
            <AnotadorClasico 
              nombreA={equipoA.join(" & ")}
              nombreB={equipoB.join(" & ")}
              puntosA={puntosA}
              puntosB={puntosB}
              sumarA={sumarA}
              sumarB={sumarB}
              modo={modo}
              habilitado={!partidaTerminada}
            />
          </div>

          {/* BOTONERA DINAMICA (Opcional) */}
          {inputMethod === "dynamic" && !partidaTerminada && (
            <div className="dynamic-global-controls">
              <div className="dynamic-team-panel">
                <h4>{equipoA.join(" & ")}</h4>
                <div className="dyn-btn-group">
                  <button onClick={() => sumarA(1)}>Env (1)</button>
                  <button onClick={() => sumarA(2)}>Env Q/Truco (2)</button>
                  <button onClick={() => sumarA(3)}>Real/Retruco (3)</button>
                  <button onClick={() => sumarA(4)}>Vale 4</button>
                  {florEnabled && <button className="flor-btn" onClick={() => sumarA(3)}>Flor</button>}
                  <button className="falta-envido-btn" onClick={() => sumarA(faltaEnvidoPuntos)}>Falta Envido</button>
                </div>
              </div>
              <div className="dynamic-team-panel">
                <h4>{equipoB.join(" & ")}</h4>
                <div className="dyn-btn-group">
                  <button onClick={() => sumarB(1)}>Env (1)</button>
                  <button onClick={() => sumarB(2)}>Env Q/Truco (2)</button>
                  <button onClick={() => sumarB(3)}>Real/Retruco (3)</button>
                  <button onClick={() => sumarB(4)}>Vale 4</button>
                  {florEnabled && <button className="flor-btn" onClick={() => sumarB(3)}>Flor</button>}
                  <button className="falta-envido-btn" onClick={() => sumarB(faltaEnvidoPuntos)}>Falta Envido</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}