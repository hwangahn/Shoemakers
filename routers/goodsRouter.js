const express = require('express');
const { getShoeByGender, getShoeById, getShoeByName } = require('../controllers/goodsController');

let router = express.Router();

router.get('/api/gender/:gender', getShoeByGender);

router.get('/api/shoe/:sid', getShoeById);

router.get('/api/search/:name', getShoeByName);

module.exports = router;