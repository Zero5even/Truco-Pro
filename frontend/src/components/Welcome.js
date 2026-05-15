import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    const motivationalMessages = [
      "Preparando todo para tu mejor experiencia...",
      "Grandes cosas empiezan con pequeños momentos como este...",
      "Tu tiempo es valioso, gracias por esperar...",
      "Mientras cargamos, recuerda: hoy es un gran día...",
      "Preparando la parrilla para tus mejores momentos...",
      "Cada momento de espera acerca a un momento de disfrute..."
    ];

    const getRandomMessage = () => {
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      return motivationalMessages[randomIndex];
    };

    const checkServerStatus = async () => {
      try {
        const isReady = Math.random() > 0.5;
        if (isReady) {
          setIsLoading(false);
        }
        return isReady;
      } catch (error) {
        console.error("Error checking server status:", error);
        return false;
      }
    };

    setMotivationalMessage(getRandomMessage());

    let messageInterval;
    let statusCheckInterval;

    const initializeLoading = async () => {
      const isReady = await checkServerStatus();

      if (!isReady) {
        messageInterval = setInterval(() => {
          setMotivationalMessage(getRandomMessage());
        }, 3000);

        statusCheckInterval = setInterval(() => {
          checkServerStatus();
        }, 5000);
      }
    };

    initializeLoading();

    return () => {
      clearInterval(messageInterval);
      clearInterval(statusCheckInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="welcome-container">
        <h1>Barrio Tiro Federal</h1>
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-message">{motivationalMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-container">
      <h1>Bienvenido al Barrio Tiro Federal</h1>
      <p>¡Gracias por visitar nuestro sitio web!</p>

      <Link to="/reservas" className="reservation-link">
        Reservar Parrilla
      </Link>

      <hr />

      <Link to="/futbol" className="reservation-link">
        PROXIMAMENTE NUEVA SECCION
      </Link>
    </div>
  );
};

export default Welcome;
