const Movie = require('../models/movie.js');
const Genre = require('../models/genre.js');
const { validateMovie } = require('../utils/validate.js');


class MovieController {

  getAll = async (req, res, next) => {
    try {
      const allMovies = await Movie
        .find()
        .populate('genre', '_id value');

      res.send(allMovies);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  getOne = async (req, res, next) => {
    try {
      const requestedMovie = await Movie
        .findById(req.params.id)
        .populate('genre', '_id value');

      if (!requestedMovie) return next({ 'code': 404, 'log': 'Movie with given ID not found' });
      res.send(requestedMovie);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  createOne = async (req, res, next) => {
    const { value, error } = validateMovie(req.body);
    if (error) return next({ 'code': 400, 'log': error['details'][0]['message'] });

    try {
      // check if genre exists
      const genre = await Genre.findById(value.genreId);
      if (!genre) return next({ 'code': 404, 'log': 'Genre with given ID not found' });

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
      next({ 'code': 500, 'log': exc.message });
    }
  }


  updateOne = async (req, res, next) => {
    try {
      // get the movie
      const requestedMovie = await Movie
        .findById(req.params.id)
        .select('title genre numberInStock dailyRentalFee -_id');

      if (!requestedMovie) return next({ 'code': 404, 'log': 'Movie with given ID not found' });

      // prepare an object to be validated
      const proposedUpdate = {
        'title': req.body.title || requestedMovie.title,
        'genreId': req.body.genreId || (requestedMovie.genre._id).toString(),
        'numberInStock': req.body.numberInStock || requestedMovie.numberInStock,
        'dailyRentalFee': req.body.dailyRentalFee || requestedMovie.dailyRentalFee
      };

      // validate the request
      const { value, error } = validateMovie(proposedUpdate);
      if (error) return next({ 'code': 400, 'log': error['details'][0]['message'] });

      // fetch the genre
      const genre = await Genre.findById(value.genreId);
      if (!genre) return next({ 'code': 404, 'log': 'Genre with given ID not found' });

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
      next({ 'code': 500, 'log': exc.message });
    }
  }


  deleteOne = async (req, res, next) => {
    try {
      const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
      if (!deletedMovie) return next({ 'code': 404, 'log': 'Movie with given ID not found' });
      res.send(deletedMovie);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }

}


const movieController = new MovieController();
module.exports = movieController;