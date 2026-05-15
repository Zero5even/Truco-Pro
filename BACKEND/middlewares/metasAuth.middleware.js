import jwt from 'jsonwebtoken';

const metasAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Falta header Authorization' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Formato Authorization inválido' });
    }

    const token = parts[1];

    
if (!token || token === 'undefined' || token === 'null') {
  return res.status(401).json({ message: 'Token vacío o inválido' });
}


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    console.error('AUTH ERROR:', error.message);
    return res.status(401).json({ message: 'No autorizado' });
  }
};

export default metasAuth;
