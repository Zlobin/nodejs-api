const router = require('express').Router();

router.use('/api', require('./api'));
router.use('/auth', require('./auth'));
router.get('/', (req, res) => {
  res.json({
    success: true,
    payload: {
      message: 'API is working'
    }
  });
});

module.exports = router;
