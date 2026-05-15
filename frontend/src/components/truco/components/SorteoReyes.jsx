import { useState, useEffect } from "react";
import "../styles/sorteoreyes.css";

const palos = ["Espadas 🗡️", "Bastos 🌿", "Oros 🪙", "Copas 🍷"];
const numeros = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

// Crear y mezclar el mazo de 40 cartas
const getMazoMezclado = () => {
  const mazo = [];
  palos.forEach(palo => {
    numeros.forEach(numero => {
      mazo.push({ numero, palo });
    });
  });
  // Shuffle de Fisher-Yates
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
  }
  return mazo;
};

export default function SorteoReyes({ jugadores, onEquiposDefinidos, onCancel }) {
  // Inicializamos el mazo una sola vez al montar
  const [mazo] = useState(getMazoMezclado());
  const [indiceMazo, setIndiceMazo] = useState(0);

  const [cartas, setCartas] = useState(jugadores.map(() => null));
  const [reyes, setReyes] = useState([]); // Índices de jugadores que ya sacaron rey
  const [turno, setTurno] = useState(0);
  const [sorteoTerminado, setSorteoTerminado] = useState(false);
  const [equipos, setEquipos] = useState(null);

  useEffect(() => {
    if (sorteoTerminado || jugadores.length < 4 || indiceMazo >= mazo.length) return;

    const timer = setTimeout(() => {
      // Si el jugador actual ya tiene un rey, saltamos su turno inmediatamente
      if (reyes.includes(turno)) {
        setTurno((prev) => (prev + 1) % jugadores.length);
        return;
      }

      // Sacar la siguiente carta del mazo
      const nuevaCarta = mazo[indiceMazo];
      setIndiceMazo(prev => prev + 1);
      
      setCartas((prev) => {
        const newCartas = [...prev];
        newCartas[turno] = nuevaCarta;
        return newCartas;
      });

      if (nuevaCarta.numero === 12) {
        const nuevosReyes = [...reyes, turno];
        setReyes(nuevosReyes);
        
        // Criterio dinámico: 
        // Si hay exactamente 4 jugadores, bastan 2 reyes para armar los equipos.
        // Si hay más de 4 jugadores, necesitamos 4 reyes para filtrar quiénes juegan.
        const limiteReyes = jugadores.length === 4 ? 2 : 4;
        
        if (nuevosReyes.length === limiteReyes) {
          setSorteoTerminado(true);
          
          let teamA, teamB;
          
          if (jugadores.length === 4) {
            // Con 4 jugadores, los dos reyes son el equipo A, los otros el B
            teamA = [jugadores[nuevosReyes[0]], jugadores[nuevosReyes[1]]];
            const indicesRestantes = [0, 1, 2, 3].filter(i => !nuevosReyes.includes(i));
            teamB = [jugadores[indicesRestantes[0]], jugadores[indicesRestantes[1]]];
          } else {
            // Con más de 4, los 4 reyes son los que juegan
            teamA = [jugadores[nuevosReyes[0]], jugadores[nuevosReyes[1]]];
            teamB = [jugadores[nuevosReyes[2]], jugadores[nuevosReyes[3]]];
          }
          
          setEquipos({ equipoA: teamA, equipoB: teamB });
          return;
        }
      }

      setTurno((prev) => (prev + 1) % jugadores.length);

    }, 300); // Velocidad más rápida (300ms) para que sea dinámico pero no desesperante

    return () => clearTimeout(timer);
  }, [turno, reyes, sorteoTerminado, jugadores, indiceMazo, mazo]);

  const handleAceptar = () => {
    if (equipos) {
      onEquiposDefinidos(equipos.equipoA, equipos.equipoB);
    }
  };

  return (
    <div className="reyes-container">
      <h2 className="reyes-title">Tirar los Reyes</h2>
      {!sorteoTerminado && <p className="reyes-subtitle">Repartiendo cartas...</p>}
      {sorteoTerminado && <p className="reyes-subtitle success">¡Equipos definidos!</p>}

      <div className="reyes-mesa">
        {jugadores.map((jugador, index) => {
          const carta = cartas[index];
          const esRey = reyes.includes(index);
          const indexEnReyes = reyes.indexOf(index);
          const esEquipoA = sorteoTerminado && (indexEnReyes === 0 || indexEnReyes === 1);
          const esEquipoB = sorteoTerminado && (indexEnReyes === 2 || indexEnReyes === 3);
          const enEspera = sorteoTerminado && !esRey;

          return (
            <div 
              key={index} 
              className={`reyes-jugador ${index === turno && !sorteoTerminado ? "activo" : ""} 
                         ${esEquipoA ? "equipo-a" : ""} ${esEquipoB ? "equipo-b" : ""}
                         ${enEspera ? "en-espera" : ""}`}
            >
              <div className="nombre">{jugador}</div>
              <div className={`carta ${carta ? "volteada" : ""} ${esRey ? "carta-rey" : ""}`}>
                {carta ? (
                  <>
                    <span className="carta-num">{carta.numero}</span>
                    <span className="carta-palo">{carta.palo}</span>
                  </>
                ) : (
                  <div className="carta-dorso"></div>
                )}
              </div>
              {esEquipoA && <span className="team-badge">Equipo 1</span>}
              {esEquipoB && <span className="team-badge">Equipo 2</span>}
              {enEspera && <span className="team-badge wait-badge">En Espera</span>}
            </div>
          );
        })}
      </div>

      {sorteoTerminado && (
        <button className="reyes-aceptar-btn" onClick={handleAceptar}>
          Aceptar Equipos
        </button>
      )}
      {!sorteoTerminado && (
        <button className="reyes-cancelar-btn" onClick={onCancel}>
          Cancelar Sorteo
        </button>
      )}
    </div>
  );
}
