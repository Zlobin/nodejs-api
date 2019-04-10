const router = require('express').Router();
const mongoose = require('mongoose');
const { validateToken } = require('../../middleware/validate-token');
const CRUD = require('./crud');

class Article extends CRUD {}
const article = new Article(mongoose.model('Article'), ['title', 'slug', 'body', 'userId']);

router.get('/', article.find.bind(article));
router.post('/', validateToken, article.create.bind(article));
router.put('/', validateToken, article.update.bind(article));
router.delete('/', validateToken, article.delete.bind(article));

module.exports = router;
