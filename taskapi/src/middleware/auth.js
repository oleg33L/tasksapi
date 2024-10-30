const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'your_secret_key');

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Authentication Error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access denied. Token has expired.' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Access denied. Invalid token.' });
    }

    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

