import { useState, useEffect } from "react";
import { obtenerJugadores, crearJugador, eliminarJugador } from "../services/trucoApi";
import "../styles/players.css";

export default function PlayerManager({
  onSorteo,
  onEquiposDefinidos
}) {
  const [dbPlayers, setDbPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [nuevo, setNuevo] = useState("");
  const [view, setView] = useState("select"); // 'select' | 'manual'
  
  // Para armado manual
  const [manualTeamA, setManualTeamA] = useState([]);
  const [manualTeamB, setManualTeamB] = useState([]);

  useEffect(() => {
    cargarJugadoresBD();
  }, []);

  const cargarJugadoresBD = async () => {
    try {
      const res = await obtenerJugadores();
      setDbPlayers(res.data);
    } catch (error) {
      console.error("Error detallado cargando jugadores:", error.response || error);
    }
  };

  const agregarNuevoJugador = async () => {
    const nombre = nuevo.trim().toUpperCase();
    if (!nombre) return;

    // Verificar si ya existe en la lista local para evitar duplicados visuales
    if (dbPlayers.some(p => p.nombre === nombre)) {
      const existente = dbPlayers.find(p => p.nombre === nombre);
      toggleSelectPlayer(existente);
      setNuevo("");
      return;
    }

    try {
      const res = await crearJugador({ nombre });
      setDbPlayers(prev => [...prev, res.data]);
      toggleSelectPlayer(res.data);
      setNuevo("");
    } catch (error) {
      console.error("Error creando jugador", error);
      if (error.response && error.response.status === 400) {
        alert("Ese jugador ya existe en la base de datos.");
      } else {
        alert("Error de conexión. ¿Está encendido el servidor BACKEND?");
      }
    }
  };

  const borrarDeBD = async (id, nombre) => {
    if(!window.confirm(`¿Seguro que quieres eliminar a ${nombre} de la base de datos para siempre?`)) return;
    try {
      await eliminarJugador(id);
      setDbPlayers(prev => prev.filter(p => p._id !== id));
      setSelectedPlayers(prev => prev.filter(p => p.nombre !== nombre));
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") agregarNuevoJugador();
  };

  const toggleSelectPlayer = (jugador) => {
    if (selectedPlayers.some(p => p.nombre === jugador.nombre)) {
      setSelectedPlayers(prev => prev.filter(p => p.nombre !== jugador.nombre));
    } else {
      setSelectedPlayers(prev => [...prev, jugador]);
    }
  };

  const iniciarArmadoManual = () => {
    if (![4, 6].includes(selectedPlayers.length)) {
      alert("Para armar equipos manualmente debes seleccionar 4 o 6 jugadores.");
      return;
    }
    setManualTeamA([]);
    setManualTeamB([]);
    setView("manual");
  };

  const assignToTeam = (jugador, team) => {
    const teamSize = selectedPlayers.length / 2;
    if (team === 'A') {
      if (manualTeamA.length < teamSize) setManualTeamA(prev => [...prev, jugador]);
    } else {
      if (manualTeamB.length < teamSize) setManualTeamB(prev => [...prev, jugador]);
    }
  };

  const unassignFromTeam = (jugador, team) => {
    if (team === 'A') {
      setManualTeamA(prev => prev.filter(p => p.nombre !== jugador.nombre));
    } else {
      setManualTeamB(prev => prev.filter(p => p.nombre !== jugador.nombre));
    }
  };

  const confirmarEquiposManuales = () => {
    const teamSize = selectedPlayers.length / 2;
    if (manualTeamA.length === teamSize && manualTeamB.length === teamSize) {
      onEquiposDefinidos(
        manualTeamA.map(p => p.nombre),
        manualTeamB.map(p => p.nombre)
      );
    }
  };

  const onDragStart = (e, jugador) => {
    e.dataTransfer.setData("player", JSON.stringify(jugador));
  };

  const onDrop = (e, team) => {
    e.preventDefault();
    const jugador = JSON.parse(e.dataTransfer.getData("player"));
    assignToTeam(jugador, team);
  };

  if (view === "manual") {
    const unassigned = selectedPlayers.filter(p => 
      !manualTeamA.some(m => m.nombre === p.nombre) && 
      !manualTeamB.some(m => m.nombre === p.nombre)
    );

    const autoAssign = (jugador) => {
      const teamSize = selectedPlayers.length / 2;
      if (manualTeamA.length < teamSize) assignToTeam(jugador, 'A');
      else if (manualTeamB.length < teamSize) assignToTeam(jugador, 'B');
    };

    return (
      <div className="players-panel">
        <h2 className="title-serif">🤝 Armado Manual</h2>
        <p className="subtitle">Arrastra los jugadores a los equipos o toca para asignar</p>

        <div className="unassigned-pool">
          {unassigned.map((j) => (
            <div 
              key={j._id} 
              className="player-chip draggable"
              draggable
              onDragStart={(e) => onDragStart(e, j)}
              onClick={() => autoAssign(j)}
            >
              <span className="drag-handle">⠿</span> {j.nombre}
            </div>
          ))}
          {unassigned.length === 0 && <p className="success-msg">¡Todos los jugadores asignados!</p>}
        </div>

        <div className="manual-teams-container">
          <div 
            className={`manual-team drop-zone ${manualTeamA.length < selectedPlayers.length / 2 ? 'active' : 'full'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 'A')}
          >
            <h3 className="title-serif">NOSOTROS</h3>
            <div className="team-slots">
              {manualTeamA.map(j => (
                <div key={j._id} className="player-chip team-a assigned" onClick={() => unassignFromTeam(j, 'A')}>
                  {j.nombre} <span className="remove-icon">✕</span>
                </div>
              ))}
              {manualTeamA.length < selectedPlayers.length / 2 && <div className="slot-placeholder">Arrastra aquí</div>}
            </div>
          </div>

          <div 
            className={`manual-team drop-zone ${manualTeamB.length < selectedPlayers.length / 2 ? 'active' : 'full'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 'B')}
          >
            <h3 className="title-serif">ELLOS</h3>
            <div className="team-slots">
              {manualTeamB.map(j => (
                <div key={j._id} className="player-chip team-b assigned" onClick={() => unassignFromTeam(j, 'B')}>
                  {j.nombre} <span className="remove-icon">✕</span>
                </div>
              ))}
              {manualTeamB.length < selectedPlayers.length / 2 && <div className="slot-placeholder">Arrastra aquí</div>}
            </div>
          </div>
        </div>

        <div className="manual-actions">
          <button className="back-btn" onClick={() => setView("select")}>Volver</button>
          <button 
            className="confirm-btn" 
            disabled={manualTeamA.length === 0 || manualTeamB.length === 0} // Permitimos jugar 1v1 o 2v2
            onClick={confirmarEquiposManuales}
          >
            Confirmar Equipos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="players-panel">
      <h2>👥 Plantel de Jugadores</h2>

      {/* INPUT */}
      <div className="player-input">
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nuevo jugador..."
        />
        <button onClick={agregarNuevoJugador}>Agregar</button>
      </div>

      {/* DB PLAYERS */}
      <div className="db-players-section">
        <h3>Disponibles (Click para seleccionar)</h3>
        <div className="quick-players">
          {dbPlayers.map((jugador) => {
            const isSelected = selectedPlayers.some(p => p.nombre === jugador.nombre);
            return (
              <div key={jugador._id} className="db-player-wrapper">
                <button
                  className={`quick-player-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSelectPlayer(jugador)}
                >
                  {jugador.nombre}
                </button>
                <button className="delete-db-btn" onClick={() => borrarDeBD(jugador._id, jugador.nombre)}>🗑️</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED PLAYERS */}
      <div className="selected-players-section">
        <h3>Seleccionados para jugar ({selectedPlayers.length})</h3>
        <div className="players-grid">
          {selectedPlayers.map((j) => (
            <div key={j._id} className="player-chip selected-chip">
              <span>{j.nombre}</span>
              <span className="remove-player" onClick={() => toggleSelectPlayer(j)}>✕</span>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="players-actions">
        {selectedPlayers.length === 2 && (
          <button 
            className="confirm-btn"
            onClick={() => onEquiposDefinidos([selectedPlayers[0].nombre], [selectedPlayers[1].nombre])}
          >
            ⚔️ Jugar Mano a Mano (1v1)
          </button>
        )}
        <button 
          className="shuffle-btn"
          disabled={![3, 4, 5, 6].includes(selectedPlayers.length)}
          onClick={() => onSorteo(selectedPlayers.map(p => p.nombre))}
        >
          👑 Tirar los Reyes
        </button>
        <button 
          className="manual-btn"
          disabled={![4, 6].includes(selectedPlayers.length)}
          onClick={iniciarArmadoManual}
        >
          🤝 Armar Manualmente
        </button>
      </div>
    </div>
  );
}