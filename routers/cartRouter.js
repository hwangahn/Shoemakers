const express = require('express');
const { getUsersOrder, addToOrder, updateQty, deleteItemFromOrder } = require('../controllers/cartController');

let router = express.Router();

router.get('/cart', getUsersOrder);

router.post('/cart/add', addToOrder);

router.post('/cart/update', updateQty);

router.post('/cart/delete', deleteItemFromOrder);

module.exports = router;