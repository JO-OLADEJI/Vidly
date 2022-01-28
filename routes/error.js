const express = require('express');
const router = express.Router();


router.all('/', (req, res) => {
  res.status(404).send('Endpoint not found!');
});


module.exports = router;