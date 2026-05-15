import "../styles/gameconfig.css";

export default function GameConfig({
  modo,
  setModo,
  florEnabled,
  setFlorEnabled,
  inputMethod,
  setInputMethod,
  onStart,
  equiposListos
}) {
  return (
    <div className="game-config-container">
      <h2 className="config-title title-serif">Configuración de Partida</h2>

      <div className="config-section">
        <h3>Modo de Juego</h3>
        <div className="config-options">
          <button
            className={`config-btn ${modo === 15 ? "active" : ""}`}
            onClick={() => setModo(15)}
          >
            A 15
          </button>
          <button
            className={`config-btn ${modo === 30 ? "active" : ""}`}
            onClick={() => setModo(30)}
          >
            A 30
          </button>
        </div>
      </div>

      <div className="config-section">
        <h3>Reglas Especiales</h3>
        <div className="config-options">
          <button
            className={`config-btn ${florEnabled ? "active" : ""}`}
            onClick={() => setFlorEnabled(true)}
          >
            Con Flor
          </button>
          <button
            className={`config-btn ${!florEnabled ? "active" : ""}`}
            onClick={() => setFlorEnabled(false)}
          >
            Sin Flor
          </button>
        </div>
      </div>

      <div className="config-section">
        <h3>Estilo de Anotador</h3>
        <div className="config-options">
          <button
            className={`config-btn ${inputMethod === "classic" ? "active" : ""}`}
            onClick={() => setInputMethod("classic")}
          >
            Clásico (+ / -)
          </button>
          <button
            className={`config-btn ${inputMethod === "dynamic" ? "active" : ""}`}
            onClick={() => setInputMethod("dynamic")}
          >
            Dinámico (Botones)
          </button>
        </div>
      </div>

      <button 
        className="start-game-btn" 
        onClick={onStart}
        disabled={!equiposListos}
      >
        {equiposListos ? "¡Empezar Partido!" : "Sortea los equipos primero"}
      </button>
    </div>
  );
}
