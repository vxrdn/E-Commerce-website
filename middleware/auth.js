const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kickskart_secret_key';

const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ detail: 'Invalid token.' });
  }
};

module.exports = { authenticateToken };
