import { createServer } from 'http';

// Esto es solo para rutas API básicas
const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('API en Vercel\n');
});

export default server;