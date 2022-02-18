const Customer = require('../database/models/customer.js');
const Movie = require('../database/models/movie.js');
const Rental = require('../database/models/rental.js');
const { validateRental } = require('../utils/validate.js');


class RentalController {

  getAll = async (req, res) => {
    try {
      const allRentals = await Rental
        .find()
        .populate('customer', '_id name')
        .populate('movie', '_id title');

      res.send(allRentals);
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }


  getOne = async (req, res) => {
    try {
      const requestedRental = await Rental
        .findById(req.params.id)
        .populate('customer', '_id name')
        .populate('movie', '_id title');

      if (!requestedRental) return res.status(404).send('Rental with the given ID not found!');
      res.send(requestedRental);
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }


  create = async (req, res) => {
    const { value, error } = validateRental(req.body);
    if (error) return res.status(400).send(error['details'][0]['message']);

    try {
      // check if customer and movie exist
      const movie = await Movie.findById(value.movieId);
      if (!movie) return res.status(404).send('Movie with given ID not found!');

      const customer = await Customer.findById(value.customerId);
      if (!customer) return res.status(404).send('Customer with given ID not found!');

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
      res.status(500).send(exc.message);
    }
  }

}


const rentalController = new RentalController();
module.exports = rentalController;