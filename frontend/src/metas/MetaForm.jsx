import { useState } from 'react';
import axios from '../axios';
import './MetaForm.css';

const MetaForm = ({ onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [impacto, setImpacto] = useState(5);
  const [esfuerzo, setEsfuerzo] = useState(5);
  const [loading, setLoading] = useState(false);

  const prioridad =
    esfuerzo > 0 ? Number((impacto / esfuerzo).toFixed(2)) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post('/metas/objetivos', {
        nombre,
        categoria,
        impacto,
        esfuerzo,
      });

      onAdd(res.data);

      // Reset
      setNombre('');
      setCategoria('');
      setImpacto(5);
      setEsfuerzo(5);
    } catch (err) {
      console.error(err);
      alert('Error al crear meta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="meta-form" onSubmit={handleSubmit}>
      <h3>➕ Nueva Meta</h3>

      <input
        type="text"
        placeholder="Nombre de la meta"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Categoría (salud, dinero, hábitos...)"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />

      {/* IMPACTO */}
      <label>
        Impacto en tu vida: <strong>{impacto}</strong>
        <span className="hint"> (1 = poco, 10 = cambia todo)</span>
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={impacto}
        onChange={(e) => setImpacto(Number(e.target.value))}
      />

      {/* ESFUERZO */}
      <label>
        Esfuerzo requerido: <strong>{esfuerzo}</strong>
        <span className="hint"> (1 = fácil, 10 = muy demandante)</span>
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={esfuerzo}
        onChange={(e) => setEsfuerzo(Number(e.target.value))}
      />

      {/* PRIORIDAD */}
      <div className="prioridad-box">
        🔥 Prioridad estratégica:{' '}
        <strong className={prioridad >= 2 ? 'alta' : 'normal'}>
          {prioridad}
        </strong>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Agregar Meta'}
      </button>
    </form>
  );
};

export default MetaForm;
