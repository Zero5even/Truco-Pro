import './Dashboard.css';

const DashboardMetrica = ({ metas = [], registros = {} }) => {
  if (!metas || metas.length === 0) return null;

  const total = metas.length;

  // Contamos por estado
  const conteo = {
    hecho: 0,
    parcial: 0,
    no_hecho: 0,
  };

  Object.values(registros).forEach((estado) => {
    if (conteo.hasOwnProperty(estado)) conteo[estado]++;
  });

  // Cálculo de eficiencia y progreso
  const eficiencia = total > 0 ? (conteo.hecho / total) * 100 : 0;
  const progreso = total > 0 ? ((conteo.hecho + conteo.parcial * 0.5) / total) * 100 : 0;

  // Ancho de barras para visualización
  const anchoHecho = Math.min(eficiencia, 100);
  const anchoParcial = Math.min(progreso - eficiencia, 100 - anchoHecho);
  const anchoNoHecho = 100 - anchoHecho - anchoParcial;

  // Contar por categoría
  const categorias = {};
  metas.forEach((meta) => {
    const cat = meta.categoria || 'Sin categoría';
    if (!categorias[cat]) categorias[cat] = 0;
    categorias[cat]++;
  });

  return (
    <div className="dashboard-metrica">
      <div className="metrica-textos">
        <div><strong>Total de metas:</strong> {total}</div>
        <div><strong>Eficiencia:</strong> {Math.round(eficiencia)}%</div>
        <div><strong>Progreso:</strong> {Math.round(progreso)}%</div>
      </div>

      {/* Barra de progreso */}
      <div className="metrica-bar">
        <div
          className="metrica-bar-hecho"
          style={{ width: `${anchoHecho}%` }}
          title={`Hecho: ${conteo.hecho}`}
        ></div>
        <div
          className="metrica-bar-parcial"
          style={{ width: `${anchoParcial}%` }}
          title={`Parcial: ${conteo.parcial}`}
        ></div>
        <div
          className="metrica-bar-no-hecho"
          style={{ width: `${anchoNoHecho}%` }}
          title={`No hecho: ${conteo.no_hecho}`}
        ></div>
      </div>

      {/* Resumen por estado */}
      <div className="metrica-resumen">
        <p><strong>Hecho:</strong> {conteo.hecho}</p>
        <p><strong>Parcial:</strong> {conteo.parcial}</p>
        <p><strong>No hecho:</strong> {conteo.no_hecho}</p>
      </div>

      {/* Resumen por categoría */}
      <div className="metrica-categorias">
        <strong>Categorías:</strong>
        <ul>
          {Object.entries(categorias).map(([cat, cant]) => (
            <li key={cat}>{cat}: {cant}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardMetrica;
