const express = require('express');
const router = express.Router();
const auth = require('../utils/auth.js');
const userController = require('../controllers/userController.js');

router.post('/', userController.register);
router.post('/login', userController.login);
router.get('/me', auth, userController.profile);

module.exports = router;