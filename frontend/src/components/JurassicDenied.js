import React, { useEffect } from 'react';
import './JurassicDenied.css';

const JurassicDenied = () => {

  useEffect(() => {
    const audio = new Audio('/sounds/nedry-laugh.mp3');
    audio.loop = true;
    audio.volume = 0.7;

    audio.play().catch(err => {
      console.error("Autoplay bloqueado por el navegador", err);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

   const handleBack = () => {
    window.location.href = '/'; // <-- vuelve al Home
  };

  return (
    <div className="jp-wrapper">
      <div className="jp-screen">
        <div className="jp-text">Ah ah ah!</div>
        <div className="jp-text">You didn't say the magic word!</div>
        <div className="jp-text">¡ACCESO DENEGADO!</div>

         

        <div className="jp-loader"></div>

        {/* 🔴 BOTÓN DE REGRESO */}
        <button className="jp-back-btn" onClick={handleBack}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default JurassicDenied;
