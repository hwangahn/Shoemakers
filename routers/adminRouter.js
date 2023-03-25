const express = require('express');
const { createStock } = require('../controllers/adminController');
const path = require('path');

let router = express.Router();

router.get('/admin', (req, res) => {
    res.status(200).render('createItem');
});

router.post('/admin/create', createStock);

module.exports = router;