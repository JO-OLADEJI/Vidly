const { validateGenre } = require('../utils/validate.js');
const Genre = require('../database/schemas/genre.js');

class GenreController {

  getAll = async (req, res) => {
    try {
      const result = await Genre.find();
      res.send(result);
    }
    catch(err) {
      res.status(400).send(err);
    }
  }
  

  getById = async (req, res) => {
    try {
      const result = await Genre.findById(req.params.id);
      if (!result) {
        res.status(404).send('Object not found');
        return;
      }
      res.send(result);
    }
    catch(err) {
      res.status(400).send(err);
    }
  }


  createOne = async (req, res) => {
    const { value, error } = validateGenre(req.body);
    if (error) {
      res.status(400).send(error['details'][0]['message']);
      return;
    }
    
    try {
      const check = await Genre.findOne({ value: value.genre });
      if (check) {
        res.send('Genre already exist!');
        return;
      }
      const newGenre = await new Genre({ value: value.genre });
      newGenre.save();
      res.send(newGenre);
    }
    catch(err) {
      res.status(400).send(err);
    }
  }

  // continue mongoDB implementation from here
  genres = [
    { id: 1, value: 'musical' }, 
    { id: 2, value: 'action' }, 
    { id: 3, value: 'comedy' }, 
    { id: 4, value: 'animation' }, 
    { id: 5, value: 'romance' }
  ];
  updateOne = (req, res) => {
  
    const genre_index = this.genres.findIndex((genre) => genre.id === parseInt(req.params.id));
    if (genre_index === -1) {
      res.status(404).send(`Genre with ID: ${req.params.id} doesn't exist`);
      return;
    }
  
    const { value, error } = validateGenre(req.body.genre);
    if (error) {
      res.status(400).send(error['details'][0]['message']);
      return;
    }
    this.genres[genre_index].value = value.toLowerCase();
    res.send(this.genres[genre_index]);
  }


  deleteOne = (req, res) => {
  
    const genre_index = this.genres.findIndex((genre) => genre.id === parseInt(req.params.id));
    if (genre_index === -1) {
      res.status(404).send(`Genre with ID: ${req.params.id} doesn't exist`);
      return;
    }
  
    const deletedGenre = this.genres[genre_index];
    this.genres.splice(genre_index, 1);
    res.send(deletedGenre);
  }

}


const genreController = new GenreController();
module.exports = genreController;