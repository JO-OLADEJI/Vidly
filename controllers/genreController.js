const { validateGenre } = require('../utils/validate.js');

class GenreController {

  genres = [
    { id: 1, value: 'musical' }, 
    { id: 2, value: 'action' }, 
    { id: 3, value: 'comedy' }, 
    { id: 4, value: 'animation' }, 
    { id: 5, value: 'romance' }
  ];

  getAll = (req, res) => {
    res.send(this.genres);
  }
  

  getById = (req, res) => {
  
    const genre_index = this.genres.findIndex((genre) => genre.id === parseInt(req.params.id));
    if (genre_index === -1) {
      res.status(404).send(`Genre with ID: ${req.params.id} doesn't exist`);
      return;
    }
    res.send(this.genres.find((genre) => genre.id === parseInt(req.params.id)));
  }


  createOne = (req, res) => {

    const { value, error } = validateGenre(req.body.genre);
    if (error) {
      res.status(400).send(error['details'][0]['message']);
      return;
    }
    
    if (this.genres.findIndex((genre) => genre.value === value.toLowerCase()) != -1) {
      res.status(400).send('Genre already exist!');
      return;
    }
    const newGenre = { id: this.genres[this.genres.length - 1].id + 1, value: value.toLowerCase() };
    this.genres.push(newGenre);
    res.send(newGenre);
  }


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