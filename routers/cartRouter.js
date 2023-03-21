const express = require('express');
const { getCart, addToCart, updateQty, deleteItemFromCart } = require('../controllers/cartController');

let router = express.Router();

router.get('/cart', getCart);

router.post('/cart/', addToCart);

router.post('/cart/update', updateQty);

router.post('/cart/delete', deleteItemFromCart);

module.exports = router;