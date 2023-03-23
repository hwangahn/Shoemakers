const express = require('express');
const { getUsersCart, addToCart, updateQty, deleteItemFromCart } = require('../controllers/cartController');

let router = express.Router();

router.get('/cart', getUsersCart);

router.post('/cart/add_item', addToCart);

router.post('/cart/update', updateQty);

router.post('/cart/delete', deleteItemFromCart);

module.exports = router;