const express = require('express');
const { getShoeByGender, getShoeById, getShoeByName } = require('../controllers/goodsController');

let router = express.Router();

router.get('/gender/:gender', getShoeByGender);

router.get('/shoe/:sid', getShoeById);

router.post('/search', getShoeByName);

module.exports = router;