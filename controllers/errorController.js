class ErrorController {

  invalidEndpoint = (req, res) => {
    res.status(404).send('Exception: Endpoint not found❗');
  }

}


const errorController = new ErrorController();
module.exports = errorController;