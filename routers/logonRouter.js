const express = require('express');
const { loginRequest, registerRequest, logoutRequest } = require('../controllers/logonController');

let router = express.Router();

router.get('/login', (req, res) => {
    res.status(200).render("login");
});

router.get('/register', (req, res) => {
    res.status(200).render("register");
});

router.get('/logout', logoutRequest);

router.post('/login', loginRequest);

router.post('/register', registerRequest);

module.exports = router;