const express = require('express');
const router = express.Router();
const { validateGenre } = require('../utils/validate.js');


// DB in memory
const genres = [
  { id: 1, value: 'musical' }, 
  { id: 2, value: 'action' }, 
  { id: 3, value: 'comedy' }, 
  { id: 4, value: 'animation' }, 
  { id: 5, value: 'romance' }
];


router.get('/', (req, res) => {
  res.send(genres);
});


router.get('/:id', (req, res) => {
  
  const genre_index = genres.findIndex((genre) => genre.id === parseInt(req.params.id));
  if (genre_index === -1) {
    res.status(404).send(`Genre with ID: ${req.params.id} doesn't exist`);
    return;
  }

  res.send(genres.find((genre) => genre.id === parseInt(req.params.id)));
});


router.post('/', (req, res) => {

  const { value, error } = validateGenre(req.body.genre);
  if (error) {
    res.status(400).send(error['details'][0]['message']);
    return;
  }
  
  if (genres.findIndex((genre) => genre.value === value.toLowerCase()) != -1) {
    res.status(400).send('Genre already exist!');
    return;
  }
  
  const newGenre = { id: genres[genres.length - 1].id + 1, value: value.toLowerCase() };
  genres.push(newGenre);
  
  res.send(newGenre);
});


router.put('/:id', (req, res) => {
  
  const genre_index = genres.findIndex((genre) => genre.id === parseInt(req.params.id));
  if (genre_index === -1) {
    res.status(404).send(`Genre with ID: ${req.params.id} doesn't exist`);
    return;
  }

  const { value, error } = validateGenre(req.body.genre);
  if (error) {
    res.status(400).send(error['details'][0]['message']);
    return;
  }

  genres[genre_index].value = value.toLowerCase();
  res.send(genres[genre_index]);
});


router.delete('/:id', (req, res) => {
  
  const genre_index = genres.findIndex((genre) => genre.id === parseInt(req.params.id));
  if (genre_index === -1) {
    res.status(404).send(`Genre with ID: ${req.params.id} doesn't exist`);
    return;
  }

  const deletedGenre = genres[genre_index];
  genres.splice(genre_index, 1);
  res.send(deletedGenre);
});



module.exports = router;