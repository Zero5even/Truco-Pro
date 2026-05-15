// config.js
const isProduction = process.env.NODE_ENV === 'production';

const backendURL = isProduction
  ? 'https://barrio-back.onrender.com/api' // URL de producción
  : 'http://localhost:5075/api'; // URL de desarrollo local

export default backendURL;