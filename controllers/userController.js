const User = require('../database/models/user.js');
const { validateUser, validateLoginCredentials } = require('../utils/validate.js');
const dotenv = require('dotenv');
dotenv.config();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class UserController {

  register = async (req, res) => {
    const { value, error } = validateUser(req.body);
    if (error) return res.status(400).send(error['details'][0]['message']);

    try {
      // check if an account with the given email already exists
      let user = await User.findOne({ 'email': value.email });
      if (user) return res.status(400).send('Error: user already exists!');

      user = new User(_.pick(value, ['name', 'email', 'password']));

      // hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(user.password, salt);
      user['password'] = passwordHash;
      await user.save();

      // authenticate the user: token in header
      const token = user.genAuthToken();
      res
        .header('x-auth-token', token)
        .send(user);
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }
  

  login = async (req, res) => {
    const { value, error } = validateLoginCredentials(req.body);
    if (error) res.status(400).send(error['details'][0]['message']);

    try {
      // get the user by email
      const user = await User.findOne({ 'email': value.email });
      if (!user) return res.status(400).send('Invalid email or password!');

      // compare the password with hash
      const match = await bcrypt.compare(value.password, user.password);
      if (!match) return res.status(400).send('Invalid email or password!');

      // authenticate the user: token in header
      const token = user.genAuthToken();
      res
        .header('x-auth-token', token)
        .send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }
  

  profile = async (req, res) => {
    // get the token from the request's header
    const token = req.headers['x-auth-token'];
    if (!token) return res.send(400).send('Error: No token provided!');
    let encodedObject;

    try {
      // verify the token
      encodedObject = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (exc) {
      return res.status(401).send(exc.message);
    }

    try {
      // send the user object
      const user = await User.findById(encodedObject._id);
      if (!user) return res.status(404).send('Error: user with given token(ID) not found!');
      res.send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (exc) {
      res.status(500).send(exc.message);
    }
  }

}

const userController = new UserController();
module.exports = userController;