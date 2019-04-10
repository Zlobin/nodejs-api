const router = require('express').Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { secret } = require('../config');

class Auth {
  async login (req, res) {
    const { email, password } = req.body.payload || {};
    let response;

    if (email && password) {
      try {
        const isAuth = await mongoose.model('User').validatePassword(email, password);

        if (isAuth) {
          const token = jwt.sign({ email }, secret, {
            expiresIn: '24h'
          });
          response = {
            success: true,
            payload: {
              token
            }
          };
        } else {
          response = {
            success: false,
            error: 'Authentication failed. Incorrect username or password.'
          };
        }
      } catch (e) {
        response = {
          success: false,
          error: `Error when authentication. ${e}`
        };
      }
    } else {
      response = {
        success: false,
        error: 'Authentication failed. No username or password.'
      };
    }

    res.json(response);
  }
  logout (req, res) {
    /*
     * @TODO add blacklist with tokens.
     */
    res.json({
      success: true,
      error: 'Logout.'
    });
  }
}

const auth = new Auth();

router.post('/login', auth.login);
router.get('/logout', auth.logout);

module.exports = router;
