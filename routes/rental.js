const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController.js');

router.get('/', rentalController.getAll);
router.get('/:id', rentalController.getOne);
router.post('/', rentalController.create);


module.exports = router;