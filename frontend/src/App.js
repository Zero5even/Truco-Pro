import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './components/Welcome';
import Reservation from './components/Reservation';
import JurassicDenied from './components/JurassicDenied';

import Login from './auth/Login';
import Register from './auth/Register';
import ProtectedRoute from './auth/ProtectedRoute';
import Dashboard from './metas/Dashboard';
import TrucoGame from "./components/truco/TrucoGame";
import Ranking from "./components/truco/components/Ranking";


function App() {
  return (
    <Router>
      <Routes>

        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Welcome />} />
        <Route path="/reservas" element={<Reservation />} />
        <Route path="/futbol" element={<JurassicDenied />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* truco */}
        <Route path="/truco" element={<TrucoGame />} />
        <Route path="/truco/rankings" element={<Ranking />} />


        {/* METAS (PROTEGIDO) */}
        <Route
          path="/metas"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
