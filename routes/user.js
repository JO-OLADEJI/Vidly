const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/', userController.register);
router.post('/login', userController.login);
router.get('/me', userController.profile);

module.exports = router;