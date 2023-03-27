const express = require('express');
const { updateInventory } = require('../controllers/adminController');

let router = express.Router();

router.get('/admin', (req, res) => {
    res.status(200).render('createItem');
});

router.post('/admin/create', updateInventory);

module.exports = router;