const Genre = require('../models/genre.js');
const { validateGenre } = require('../utils/validate.js');

class GenreController {

  getAll = async (req, res, next) => {
    try {
      const result = await Genre.find();
      res.send(result);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }
  

  getById = async (req, res, next) => {
    try {
      const result = await Genre.findById(req.params.id);
      if (!result) return next({ 'code': 404, 'log': 'Genre with given ID not found' });
      res.send(result);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  createOne = async (req, res, next) => {
    const { value, error } = validateGenre(req.body);
    if (error) return next({ 'code': 400, 'log': error['details'][0]['message'] });

    try {
      const check = await Genre.findOne({ 'value': value.value });
      if (check) return next({ 'code': 400, 'log': 'Genre with given <<name>> already exists' });

      const newGenre = new Genre({ 'value': value.value });
      await newGenre.save();
      res.status(201).send(newGenre);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }

  
  updateOne = async (req, res, next) => {
    const { value, error } = validateGenre(req.body);
    if (error) return next({ 'code': 400, 'log': error['details'][0]['message'] });
    
    try {
      const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
          'value': value.value
        }
      }, { new: true });
      res.send(updatedGenre);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  deleteOne = async (req, res, next) => {
    try {
      const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
      if (!deletedGenre) return next({ 'code': 404, 'log': 'Genre with given ID not found' });
      res.send(deletedGenre);
    }
    catch (exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }

}


const genreController = new GenreController();
module.exports = genreController;