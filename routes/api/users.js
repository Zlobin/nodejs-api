const router = require('express').Router();
const mongoose = require('mongoose');
const CRUD = require('./crud');
const { validateToken } = require('../../middleware/validate-token');

class User extends CRUD {};
const user = new User(mongoose.model('User'), ['email', 'bio', 'password']);

user.setFieldToFind(['email', 'bio']);
user.setRelated(['articles']);

router.get('/', user.find.bind(user));
router.post('/', validateToken, user.create.bind(user));
router.put('/', validateToken, user.update.bind(user));
router.delete('/', validateToken, user.delete.bind(user));

module.exports = router;
