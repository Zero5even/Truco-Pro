import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendURL from '../config';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${backendURL}/metas/auth/register`, {
        email,
        password,
      });

      // 🔑 clave
      localStorage.removeItem('token');

      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Error de conexión con el servidor'
      );
    }
  };

  return (
    <div>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Register;
