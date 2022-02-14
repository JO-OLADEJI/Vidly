const Genre = require('../database/models/genre.js');
const { validateGenre } = require('../utils/validate.js');

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
      if (!result) return res.status(404).send('Genre with the given ID was not found!');
      res.send(result);
    }
    catch(err) {
      res.status(400).send(err);
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
    catch(err) {
      res.status(400).send(err);
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
    catch(err) {
      res.status(400).send(err);
    }
  }


  deleteOne = async (req, res) => {
    try {
      const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
      res.send(deletedGenre);
    }
    catch(err) {
      res.status(400).send(err);
    }
  }

}


const genreController = new GenreController();
module.exports = genreController;