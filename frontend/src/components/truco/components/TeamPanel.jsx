import Marcador from "./Marcador";

import "../styles/team.css";

export default function TeamPanel({
  nombre,
  puntos,
  modo,
  sumar,
  habilitado,
  inputMethod,
  florEnabled,
  faltaEnvidoPuntos
}) {

  return (
    <div className="team-panel">

      <h2>{nombre}</h2>

      <Marcador
        puntos={puntos}
        modo={modo}
      />

      <div className="score-buttons">
        {inputMethod === "classic" ? (
          <div className="classic-buttons">
            <button
              className="btn-restar"
              disabled={!habilitado || puntos === 0}
              onClick={() => sumar(-1)}
            >
              -1
            </button>
            <button
              className="btn-sumar"
              disabled={!habilitado}
              onClick={() => sumar(1)}
            >
              +1
            </button>
          </div>
        ) : (
          <div className="dynamic-buttons">
            <div className="btn-group">
              <button disabled={!habilitado} onClick={() => sumar(1)}>Env/No querido (1)</button>
              <button disabled={!habilitado} onClick={() => sumar(2)}>Env querido (2)</button>
              <button disabled={!habilitado} onClick={() => sumar(3)}>Real Env (3)</button>
              <button className="falta-envido-btn" disabled={!habilitado} onClick={() => sumar(faltaEnvidoPuntos)}>Falta Envido ({faltaEnvidoPuntos})</button>
            </div>
            
            <div className="btn-group">
              <button disabled={!habilitado} onClick={() => sumar(2)}>Truco (2)</button>
              <button disabled={!habilitado} onClick={() => sumar(3)}>Retruco (3)</button>
              <button disabled={!habilitado} onClick={() => sumar(4)}>Vale 4</button>
            </div>

            {florEnabled && (
              <div className="btn-group">
                <button className="flor-btn" disabled={!habilitado} onClick={() => sumar(3)}>Flor (3)</button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}