import { useEffect, useState } from 'react';
import axios from '../axios';
import MetaForm from './MetaForm';
import MetaItem from './MetaItem';
import DashboardMetrica from './DashboardMetrica';
import './Dashboard.css';

const Dashboard = () => {
  const [metas, setMetas] = useState([]);
  const [registros, setRegistros] = useState({}); // {metaId: estado}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetas = async () => {
    try {
      const [metasRes, registrosRes] = await Promise.all([
        axios.get('/metas/objetivos'),
        axios.get(`/metas/registros/hoy`),
      ]);

      setMetas(metasRes.data);

      const map = {};
      registrosRes.data.forEach(r => {
        map[r.objetivoId] = r.estado;
      });
      setRegistros(map);

    } catch (err) {
      console.error(err);
      setError('Error al cargar las metas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const handleAdd = (nuevaMeta) => {
    setMetas(prev => [nuevaMeta, ...prev]);
    setRegistros(prev => ({ ...prev, [nuevaMeta._id]: '' }));
  };

  const handleUpdate = (metaActualizada) => {
    setMetas(prev =>
      prev.map(m => (m._id === metaActualizada._id ? metaActualizada : m))
    );
  };

  const handleDelete = (id) => {
    setMetas(prev => prev.filter(m => m._id !== id));
    setRegistros(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleEstadoChange = (metaId, nuevoEstado) => {
    setRegistros(prev => ({
      ...prev,
      [metaId]: nuevoEstado
    }));
  };

  if (loading) return <p>Cargando metas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard">
      <h2>📌 Mis Metas</h2>

      {/* Métricas */}
      <DashboardMetrica registros={registros} metas={metas} />

      {/* Formulario para crear nueva meta */}
      <MetaForm onAdd={handleAdd} />

      {/* Lista tipo Kanban */}
      <div className="metas-grid">
        {metas.length === 0 && <p>No hay metas creadas</p>}
        {metas
          .slice()
          .sort((a, b) => {
            const prioridadA = (a.impacto || 1) / (a.esfuerzo || 1);
            const prioridadB = (b.impacto || 1) / (b.esfuerzo || 1);
            return prioridadB - prioridadA; // DESC
          })
          .map((meta) => (
            <MetaItem
              key={meta._id}
              meta={meta}
              registro={registros[meta._id] || ''}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEstadoChange={handleEstadoChange}
            />
          ))}

      </div>
    </div>
  );
};

export default Dashboard;
