const express = require('express');
const { loginRequest, registerRequest, logoutRequest, checkCredential } = require('../controllers/logonController');

let router = express.Router();

router.post('/api/logout', logoutRequest);

router.post('/api/login', loginRequest);

router.post('/api/register', registerRequest);

router.post('/api/auth', checkCredential);

module.exports = router;