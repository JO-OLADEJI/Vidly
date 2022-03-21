const jwt = require('jsonwebtoken');
const exceptionHandler = require('./exception.js');

const auth = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) return exceptionHandler({ 'code': 400, 'log': 'No token provided' }, req, res, next);
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  }
  catch (exc) {
    return exceptionHandler({ 'code': 401, 'log': exc.message }, req, res, next);
  }
}

module.exports = auth;