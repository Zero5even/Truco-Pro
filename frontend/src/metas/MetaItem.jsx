// MetaItem.jsx
import { useState } from 'react';
import axios from '../axios';
import './MetaItem.css';
import ConfettiExplosion from 'react-confetti-explosion'; // ¡Importamos el confetti!

const MetaItem = ({ meta, onUpdate, onDelete, registro = '', onEstadoChange }) => {
  const [edit, setEdit] = useState(false);
  const [nombre, setNombre] = useState(meta?.nombre || '');
  const [categoria, setCategoria] = useState(meta?.categoria || '');
  const [impacto, setImpacto] = useState(meta?.impacto || 5);
  const [esfuerzo, setEsfuerzo] = useState(meta?.esfuerzo || 5);
  const [estado, setEstado] = useState(registro);
  const [isExploding, setIsExploding] = useState(false); // Nuevo estado para el confetti

  const hoy = new Date().toISOString().slice(0, 10);

  if (!meta) {
    return <div className="meta-card">Cargando meta...</div>;
  }

  const prioridad = (impacto / esfuerzo).toFixed(2);

  // Determinar el color del borde de la tarjeta según la prioridad
  const getBorderColor = () => {
    const p = parseFloat(prioridad);
    if (p >= 2) return '#4f46e5'; // Alta prioridad (azul índigo)
    if (p >= 1) return '#8b5cf6'; // Media prioridad (violeta)
    return '#cbd5e1';             // Baja prioridad (gris claro)
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/metas/objetivos/${meta._id}`, {
        nombre,
        categoria,
        impacto,
        esfuerzo,
      });
      onUpdate(res.data);
      setEdit(false);
    } catch (err) {
      console.error(err);
      alert('Error al guardar meta');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta meta?')) return;
    try {
      await axios.delete(`/metas/objetivos/${meta._id}`);
      onDelete(meta._id);
    } catch (err) {
      console.error(err);
      alert('Error al eliminar meta');
    }
  };

  const handleEstado = async (nuevoEstado) => {
    try {
      await axios.post('/metas/registros', {
        objetivoId: meta._id,
        estado: nuevoEstado,
        fecha: hoy,
      });
      setEstado(nuevoEstado);
      if (onEstadoChange) onEstadoChange(meta._id, nuevoEstado);

      // Si el estado cambia a 'hecho', disparamos el confetti
      if (nuevoEstado === 'hecho') {
        setIsExploding(true);
        // Opcional: Reiniciar el estado de explosión después de un corto tiempo
        setTimeout(() => setIsExploding(false), 2000); 
      }
    } catch (err) {
      console.error('Error al guardar estado:', err);
      alert('No se pudo actualizar el estado de la meta');
    }
  };

  return (
    <div className="meta-card" style={{ borderTopColor: getBorderColor() }}>
      {isExploding && (
        <ConfettiExplosion
          force={0.8}
          duration={2500}
          particleCount={100}
          width={1000}
          height={1000} // Ajusta para que cubra un área decente
          // Puedes ajustar los colores si quieres que coincidan con tu paleta
          colors={['#4f46e5', '#8b5cf6', '#22c55e', '#facc15', '#f8fafc']} 
        />
      )}

      {edit ? (
        <>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          <label>Impacto: {impacto}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={impacto}
            onChange={(e) => setImpacto(Number(e.target.value))}
          />

          <label>Esfuerzo: {esfuerzo}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={esfuerzo}
            onChange={(e) => setEsfuerzo(Number(e.target.value))}
          />

          <div className="meta-prioridad">
            🔥 Prioridad: <strong>{prioridad}</strong>
          </div>

          <div className="meta-actions">
            <button onClick={handleSave}>💾 Guardar</button>
            <button onClick={() => setEdit(false)}>❌ Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h3>{nombre}</h3>
          <p>Categoría: {categoria}</p>

          <p>
            Impacto: <strong>{impacto}</strong> · Esfuerzo:{' '}
            <strong>{esfuerzo}</strong>
          </p>

          <p className="meta-prioridad">
            🎯 Prioridad estratégica: <strong>{prioridad}</strong>
          </p>

          <div className="meta-estado">
            <button
              className={estado === 'hecho' ? 'active' : ''}
              onClick={() => handleEstado('hecho')}
            >
              ✅
            </button>
            <button
              className={estado === 'parcial' ? 'active' : ''}
              onClick={() => handleEstado('parcial')}
            >
              🟡
            </button>
            <button
              className={estado === 'no_hecho' ? 'active' : ''}
              onClick={() => handleEstado('no_hecho')}
            >
              ❌
            </button>
          </div>

          <div className="meta-actions">
            <button onClick={() => setEdit(true)}>✏️ Editar</button>
            <button onClick={handleDelete}>🗑️ Eliminar</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MetaItem;