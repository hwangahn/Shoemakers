const express = require('express');
const { getUsersOrder, alterOrder, deleteItemFromOrder, checkout } = require('../controllers/cartController');
const { checkAuthenticate } = require('../passport/localStrategy');

let router = express.Router();

router.get('/api/cart', checkAuthenticate, getUsersOrder);

router.post('/api/cart/update', checkAuthenticate, alterOrder);

router.post('/api/cart/delete', checkAuthenticate, deleteItemFromOrder);

router.post('/api/checkout', checkAuthenticate, checkout);

module.exports = router;