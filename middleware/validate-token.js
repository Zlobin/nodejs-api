const jwt = require('jsonwebtoken');
const config = require('../config');

const TOKEN_HEADER = 'authorization';

const validateToken = (req, res, next) => {
  const token = req.headers[TOKEN_HEADER].replace('Bearer ', '');

  if (token) {
    jwt.verify(token, config.secret, (error, decoded) => {
      if (error) {
        return res.json({
          success: false,
          error
        });
      } else {
        req.decoded = decoded;
        return next();
      }
    });
  } else {
    return res.json({
      success: false,
      error: 'Auth token is required'
    });
  }
};

module.exports = {
  validateToken
};
