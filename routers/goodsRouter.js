const express = require('express');
const { getShoeByGender, getShoeById, getShoeByName, addReview } = require('../controllers/goodsController');
const { checkAuthenticate } = require('../passport/localStrategy');

let router = express.Router();

router.get('/api/gender/:gender', getShoeByGender);

router.get('/api/shoe/:sid', getShoeById);

router.get('/api/search/:name', getShoeByName);

router.post('/api/shoe/:sid/review', checkAuthenticate, addReview);

module.exports = router;