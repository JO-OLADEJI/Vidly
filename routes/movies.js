const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController.js');


router.get('/', movieController.getAll);
router.get('/:id', movieController.getOne);
router.post('/', movieController.createOne);
router.put('/:id', movieController.updateOne);
router.delete('/:id', movieController.deleteOne);


module.exports = router;