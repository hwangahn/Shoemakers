const express = require('express');
const { getUsersOrder, addToOrder, updateQty, deleteItemFromOrder } = require('../controllers/cartController');

let router = express.Router();

router.get('/api/cart', getUsersOrder);

router.post('/api/cart/add', addToOrder);

router.post('/api/cart/update', updateQty);

router.post('/api/cart/delete', deleteItemFromOrder);

module.exports = router;