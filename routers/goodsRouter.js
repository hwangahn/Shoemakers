const express = require('express');
const {getShoeByCategory, getShoeById, getShoeByName} = require('../controllers/goodsController');

let router = express.Router();

router.get('/:category', getShoeByCategory);

router.get('/:category/:sid', getShoeById);

router.post('/search', getShoeByName);

module.exports = router;