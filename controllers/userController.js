class UserController {

  register = async (req, res) => {
    // verify the request's body
    // check if an account with the email already exists
    // create the user
    // hash the password
    // authenticate the user: token in header
  }
  

  login = async (req, res) => {
    // verify the request's body
    // get the user from the email - manage errors in case of !user
    // compare the password with hash
    // authenticate the user: token in header
  }
  

  profile = async (req, res) => {
    // get the token from the request's header
    // verify the token - manage errors in case of wrong or no token
    // send the user object
  }

}

const userController = new UserController();
module.exports = userController;