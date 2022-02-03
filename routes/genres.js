const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController.js');


router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);
router.post('/', genreController.createOne);
router.put('/:id', genreController.updateOne);
router.delete('/:id', genreController.deleteOne);


module.exports = router;