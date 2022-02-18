const Movie = require('../database/models/movie.js');
const Genre = require('../database/models/genre.js');
const { validateMovie } = require('../utils/validate.js');


class MovieController {

  getAll = async (req, res) => {
    try {
      const allMovies = await Movie
        .find()
        .populate('genre', '_id value');

      res.send(allMovies);
    }
    catch (exc) {
      res.status(400).send(exc.message);
    }
  }


  getOne = async (req, res) => {
    try {
      const requestedMovie = await Movie
        .findById(req.params.id)
        .populate('genre', '_id value');

      if (!requestedMovie) return res.status(404).send('Movie with the given ID was not found!');
      res.send(requestedMovie);
    }
    catch (exc) {
      res.status(400).send(exc.message);
    }
  }


  createOne = async (req, res) => {
    const { value, error } = validateMovie(req.body);
    if (error) return res.status(400).send(error['details'][0]['message']);

    try {
      // check if genre exists
      const genre = await Genre.findById(value.genreId);
      if (!genre) return res.status(404).send(`Genre with given ID not found!`);

      const movie = new Movie({
        'title': value.title,
        'genre': genre._id,
        'numberInStock': value.numberInStock,
        'dailyRentalFee': value.dailyRentalFee
      });
      const newMovie = await movie.save();
      res.send(newMovie);
    }
    catch (exc) {
      res.status(400).send(exc.message);
    }
  }


  updateOne = async (req, res) => {
    try {
      // get the movie
      const requestedMovie = await Movie
        .findById(req.params.id)
        .select('title genre numberInStock dailyRentalFee -_id');

      if (!requestedMovie) return res.status(404).send('Movie with the given ID was not found!');

      // prepare an object to be validated
      const proposedUpdate = {
        'title': req.body.title || requestedMovie.title,
        'genreId': req.body.genreId || (requestedMovie.genre._id).toString(),
        'numberInStock': req.body.numberInStock || requestedMovie.numberInStock,
        'dailyRentalFee': req.body.dailyRentalFee || requestedMovie.dailyRentalFee
      };

      // validate the request
      const { value, error } = validateMovie(proposedUpdate);
      if (error) return res.status(400).send(error['details'][0]['message']);

      // fetch the genre
      const genre = await Genre.findById(value.genreId);
      if (!genre) return res.status(404).send(`Genre with given ID not found!`);

      // update the validated movie
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
          'title': value.title,
          'genre': genre._id,
          'numberInStock': value.numberInStock,
          'dailyRentalFee': value.dailyRentalFee
        },
        $inc: {
          __v: 1
        }
      }, { new: true });

      // return the update
      res.send(updatedMovie);
    }
    catch (exc) {
      res.status(400).send(exc.message);
    }
  }


  deleteOne = async (req, res) => {
    try {
      const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
      if (!deletedMovie) return res.status(404).send('Movie with the given ID was not found!');
      res.send(deletedMovie);
    }
    catch (exc) {
      res.status(400).send(exc.message);
    }
  }

}


const movieController = new MovieController();
module.exports = movieController;