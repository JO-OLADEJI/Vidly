class ErrorController {

  invalidEndpoint = (req, res) => {
    res.status(404).send('Endpoint not found!');
  }

}


const errorController = new ErrorController();
module.exports = errorController;