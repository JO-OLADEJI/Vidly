const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const { validateGenre } = require('./utils/validate.js');
const PORT = process.env.PORT || 3000;


// const movies = [
//   { id: 1, genre: 'musical', year: 1965, name: 'Sound of Music' },
//   { id: 2, genre: 'action', year: 2013, name: 'Olympus has fallen' },
//   { id: 3, genre: 'comedy', year: 2009, name: '3 Idiots' },
//   { id: 4, genre: 'animation', year: 2004, name: 'The Incredibles' },
//   { id: 5, genre: 'romance', year: 2020, name: 'Holidate' },
// ];

const genres = [
  { id: 1, value: 'musical' }, 
  { id: 2, value: 'action' }, 
  { id: 3, value: 'comedy' }, 
  { id: 4, value: 'animation' }, 
  { id: 5, value: 'romance' }
];



// middlewares
app.use(express.json());
app.use(helmet());

if (app.get('env') === 'development') {
  console.log('Routes logging enabled . . .');
  app.use(morgan);
}



// homepage
app.get('/', (req, res) => {
  res.send('Welcome to Vidly :)');
});


// managing the genres
app.get('/api/genres', (req, res) => {
  res.send(genres);
});


app.get('/api/genres/:id', (req, res) => {
  
  const genre_index = genres.findIndex((genre) => genre.id === parseInt(req.params.id));
  if (genre_index === -1) {
    res.status(404).send(`Genre with ID: ${req.params.id} doesn't exist`);
    return;
  }

  res.send(genres.find((genre) => genre.id === parseInt(req.params.id)));
});


app.post('/api/genres', (req, res) => {

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


app.put('/api/genres/:id', (req, res) => {
  
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


app.delete('/api/genres/:id', (req, res) => {
  
  const genre_index = genres.findIndex((genre) => genre.id === parseInt(req.params.id));
  if (genre_index === -1) {
    res.status(404).send(`Genre with ID: ${req.params.id} doesn't exist`);
    return;
  }

  const deletedGenre = genres[genre_index];
  genres.splice(genre_index, 1);
  res.send(deletedGenre);
});



// wrong endpoints
app.get('/*', (req, res) => {
  res.status(404).send('Resource not found!');
});



app.listen(
  PORT, 
  () => console.log(`Server running on http://localhost:${PORT} . . .`)
);