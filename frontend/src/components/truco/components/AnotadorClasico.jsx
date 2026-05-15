import React from "react";
import Cuadrado from "./Cuadrado";
import "../styles/anotadorclasico.css";

export default function AnotadorClasico({ 
  nombreA, nombreB, 
  puntosA, puntosB, 
  sumarA, sumarB, 
  modo,
  habilitado 
}) {

  // Función para agrupar puntos en cuadrados de 5
  const renderFosforos = (puntos) => {
    // Si el modo es a 30, separamos en malas y buenas
    const limite = modo === 30 ? 15 : modo;
    const malas = Math.min(puntos, limite);
    const buenas = puntos > limite ? puntos - limite : 0;

    const renderGrupo = (pts) => {
      const grupos = Math.floor(pts / 5);
      const resto = pts % 5;
      const cuadrados = [];
      
      for (let i = 0; i < grupos; i++) {
        cuadrados.push(<Cuadrado key={`full-${i}`} valor={5} />);
      }
      if (resto > 0) {
        cuadrados.push(<Cuadrado key={`resto`} valor={resto} />);
      }
      return cuadrados;
    };

    return (
      <div className="fosforos-columna">
        <div className="grupo-malas">
          {renderGrupo(malas)}
        </div>
        {modo === 30 && (
          <>
            <div className="separador-buenas-malas"></div>
            <div className="grupo-buenas">
              {renderGrupo(buenas)}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="anotador-wrapper">
      {/* Botones Lado A */}
      <div className="controles-laterales">
        <button className="btn-circulo btn-plus" disabled={!habilitado} onClick={(e) => { e.stopPropagation(); sumarA(1); }}>+</button>
        <button className="btn-circulo btn-minus" disabled={!habilitado || puntosA === 0} onClick={(e) => { e.stopPropagation(); sumarA(-1); }}>-</button>
      </div>

      <div className="anotador-tabla">
        <div className="anotador-header">
          <div className="header-celda title-serif">{nombreA}</div>
          <div className="header-celda title-serif">{nombreB}</div>
        </div>
        
        <div className="anotador-cuerpo">
          <div 
            className="mitad-anotador mitad-izquierda" 
            onClick={() => habilitado && sumarA(1)}
          >
            {renderFosforos(puntosA)}
          </div>
          
          <div className="linea-vertical"></div>

          <div 
            className="mitad-anotador mitad-derecha" 
            onClick={() => habilitado && sumarB(1)}
          >
            {renderFosforos(puntosB)}
          </div>
        </div>
      </div>

      {/* Botones Lado B */}
      <div className="controles-laterales">
        <button className="btn-circulo btn-plus" disabled={!habilitado} onClick={(e) => { e.stopPropagation(); sumarB(1); }}>+</button>
        <button className="btn-circulo btn-minus" disabled={!habilitado || puntosB === 0} onClick={(e) => { e.stopPropagation(); sumarB(-1); }}>-</button>
      </div>
    </div>
  );
}
