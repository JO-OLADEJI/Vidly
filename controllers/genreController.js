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
      const check = await Genre.findOne({ 'value': value.value });
      if (check) {
        res.send('Genre already exist!');
        return;
      }
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
    if (error) {
      res.status(404).send(error['details'][0]['message']);
      return;
    }
    
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