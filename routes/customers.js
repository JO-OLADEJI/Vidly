const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController.js');


router.get('/', customerController.getAll);
router.get('/:id', customerController.getOne);
router.post('/', customerController.createOne);
router.put('/:id', customerController.updateOne);
router.delete('/:id', customerController.deleteOne);


module.exports = router;