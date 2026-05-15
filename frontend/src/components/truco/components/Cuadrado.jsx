import React from "react";

export default function Cuadrado({ valor, size = 60 }) {
  // Fosforitos: x1,y1 a x2,y2 para el palito. cx,cy para la cabecita roja.
  const fosforos = [
    { x1: 5,  y1: 10, x2: 5,  y2: 50, cx: 5, cy: 10 },   // 1: Izquierda (cabeza arriba)
    { x1: 5,  y1: 5,  x2: 45, y2: 5,  cx: 45, cy: 5 },   // 2: Arriba (cabeza derecha)
    { x1: 50, y1: 5,  x2: 50, y2: 45, cx: 50, cy: 45 },  // 3: Derecha (cabeza abajo)
    { x1: 5,  y1: 50, x2: 45, y2: 50, cx: 5, cy: 50 },   // 4: Abajo (cabeza izquierda)
    { x1: 5,  y1: 50, x2: 50, y2: 5,  cx: 50, cy: 5 },   // 5: Diagonal (cabeza arriba-derecha)
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 55 55" style={{ overflow: "visible", margin: "5px" }}>
      {fosforos.slice(0, valor).map((f, i) => (
        <g key={i} className="fosforo-animado">
          {/* Sombra */}
          <line x1={f.x1 + 2} y1={f.y1 + 2} x2={f.x2 + 2} y2={f.y2 + 2} stroke="rgba(0,0,0,0.5)" strokeWidth="4" strokeLinecap="round" />
          {/* Palito de madera */}
          <line x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} stroke="#f5deb3" strokeWidth="4" strokeLinecap="round" />
          {/* Cabecita roja del fósforo */}
          <circle cx={f.cx} cy={f.cy} r="4" fill="#c0392b" />
        </g>
      ))}
    </svg>
  );
}