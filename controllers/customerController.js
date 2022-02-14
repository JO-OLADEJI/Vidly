const Customer = require('../database/models/customer.js');
const { validateCustomer } = require('../utils/validate.js');

class CustomerController {

  getAll = async (req, res) => {
    try {
      const allCustomers = await Customer.find();
      res.send(allCustomers);
    }
    catch(exc) {
      res.status(400).send(exc.message);
    }
  }


  getOne = async (req, res) => {
    try {
      const requestedCustomer = await Customer.findById(req.params.id);
      if (!requestedCustomer) return res.status(404).send('Customer with the given ID was not found!');
      res.send(requestedCustomer);
    }
    catch(exc) {
      res.status(400).send(exc.message);
    }
  }


  createOne = async (req, res) => {
    const { value, error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error['details'][0]['message']);

    const { name, phone, isGold } = value;
    const newCustomer = new Customer({ name, phone, isGold });
    try {
      const saved = await newCustomer.save();
      res.send(saved);
    }
    catch(exc) {
      res.status(400).send(exc.message);
    }
  }


  updateOne = async (req, res) => {
    try {
      const requestedCustomer = await Customer.findById(req.params.id);
      if (!requestedCustomer) return res.status(404).send('Customer with the given ID was not found!');

      const { name, phone, isGold } = req.body;
      const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
          'name': name || requestedCustomer.name,
          'phone': phone || requestedCustomer.phone,
          'isGold': isGold || requestedCustomer.isGold
        },
        $inc: {
          __v: 1
        }
      }, { new: true });
      res.send(updatedCustomer);
    }
    catch(exc) {
      res.status(400).send(exc.message);
    }
  }


  deleteOne = async (req, res) => {
    try {
      const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
      res.send(deletedCustomer);
    }
    catch(exc) {
      res.status(400).send(exc.message);
    }
  }

}


const customerController = new CustomerController();
module.exports = customerController;