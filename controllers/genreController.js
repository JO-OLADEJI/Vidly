const Genre = require('../database/models/genre.js');
const { validateGenre } = require('../utils/validate.js');

class GenreController {

  getAll = async (req, res) => {
    try {
      const result = await Genre.find();
      res.send(result);
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }
  

  getById = async (req, res) => {
    try {
      const result = await Genre.findById(req.params.id);
      if (!result) return res.status(404).send('Genre with the given ID was not found!');
      res.send(result);
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }


  createOne = async (req, res) => {
    const { value, error } = validateGenre(req.body);
    if (error) return res.status(400).send(error['details'][0]['message']);

    try {
      const check = await Genre.findOne({ 'value': value.value });
      if (check) return res.status(400).send('Genre with the given ID already exists!');

      const newGenre = new Genre({ 'value': value.value });
      await newGenre.save();
      res.send(newGenre);
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }

  
  updateOne = async (req, res) => {
    const { value, error } = validateGenre(req.body);
    if (error) return res.status(400).send(error['details'][0]['message']);
    
    try {
      const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
          'value': value.value
        }
      }, { new: true });
      res.send(updatedGenre);
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }


  deleteOne = async (req, res) => {
    try {
      const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
      res.send(deletedGenre);
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }

}


const genreController = new GenreController();
module.exports = genreController;