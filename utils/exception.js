const exceptionHandler = (err, req, res, next) => {
  // log the error
  // send an appropriate response to the user
  res.status(err.code).send(`Exception: ${err.log} ❗`);
}

module.exports = exceptionHandler;