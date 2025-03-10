const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; 

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token found in header' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Invalid token, decoding failed' });
      }

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized, user not found' });
      }

      next(); 
    } catch (error) {
      console.error('JWT Verification Error:', error.name, error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired, please log in again' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token, please log in again' });
      }
      return res.status(401).json({ message: 'Unauthorized, token verification failed' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }
};

module.exports = protect;
