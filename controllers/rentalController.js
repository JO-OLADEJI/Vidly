const Customer = require('../models/customer.js');
const Movie = require('../models/movie.js');
const Rental = require('../models/rental.js');
const { validateRental } = require('../utils/validate.js');


class RentalController {

  getAll = async (req, res, next) => {
    try {
      const allRentals = await Rental
        .find()
        .populate('customer', '_id name')
        .populate('movie', '_id title');

      res.send(allRentals);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  getOne = async (req, res, next) => {
    try {
      const requestedRental = await Rental
        .findById(req.params.id)
        .populate('customer', '_id name')
        .populate('movie', '_id title');

      if (!requestedRental) return next({ 'code': 404, 'log': 'Rental with given ID not found' });
      res.send(requestedRental);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  create = async (req, res, next) => {
    const { value, error } = validateRental(req.body);
    if (error) return next({ 'code': 400, 'log': error['details'][0]['message'] });

    try {
      // check if customer and movie exist
      const movie = await Movie.findById(value.movieId);
      if (!movie) return next({ 'code': 404, 'log': 'Movie with given ID not found' });

      const customer = await Customer.findById(value.customerId);
      if (!customer) return next({ 'code': 404, 'log': 'Customer with given ID not found' });

      // organize the request body
      const proposedRental = new Rental({
        'customer': customer._id,
        'movie': movie._id
      });

      // save the rental: use Fawn to ensure a transaction
      const rental = await proposedRental.save();

      // decrement the movie 'numberInStock'
      await Movie.findByIdAndUpdate(movie._id, {
        $inc: {
          'numberInStock': -1
        }
      });

      res.send(rental);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }

}


const rentalController = new RentalController();
module.exports = rentalController;