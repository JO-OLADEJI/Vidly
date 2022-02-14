const Movie = require('../database/models/movie.js');
const Genre = require('../database/models/genre.js');
const { validateMovie } = require('../utils/validate.js');


class MovieController {

  getAll = async (req, res) => {
    try {
      const allMovies = await Movie.find();
      res.send(allMovies);
    }
    catch (exc) {
      res.status(400).send(exc.message);
    }
  }


  getOne = async (req, res) => {
    try {
      const requestedMovie = await Movie.findById(req.params.id);
      if (!requestedMovie) return res.status(404).send('Movie with the given ID was not found!');
      res.send(result);
    }
    catch (exc) {
      res.status(400).send(exc.message);
    }
  }


  createOne = async (req, res) => {
    const { value, error } = validateMovie(req.body);
    if (error) return res.status(400).send(error['details'][0]['message']);

    try {
      // fetch the genre for the movie - for a hybrid data relationship
      const associatedGenre = await Genre
        .findOne({ 'value': (value.genre).toLowerCase() })
        .select('value');
      if (!associatedGenre) return res.status(400).send(`Entered movie genre: <${(value.genre).toLowerCase()}> not found!`);

      const movie = new Movie({
        'title': value.title,
        'genre': associatedGenre,
        'numberInStock': value.numberInStock,
        'dailyRentalRate': value.dailyRentalRate
      });
      const newMovie = await movie.save();
      res.send(newMovie);
    }
    catch (exc) {
      res.status(400).send(exc.message);
    }
  }


  updateOne = async (req, res) => {
    res.send('Updating movie with the given ID . . .');
  }


  deleteOne = async (req, res) => {
    res.send('Deleting movie with the given ID . . .');
  }


}


const movieController = new MovieController();
module.exports = movieController;