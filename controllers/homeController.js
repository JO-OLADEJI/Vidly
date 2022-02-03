class HomeController {

  home = (req, res) => {
    res.send('Welcome to Vidly :)');
  }

}


const homeController = new HomeController();
module.exports = homeController;