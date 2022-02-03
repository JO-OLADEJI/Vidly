const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController.js');


router.all('/', errorController.invalidEndpoint);


module.exports = router;