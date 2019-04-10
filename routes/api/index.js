const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/articles', require('./articles'));

module.exports = router;
