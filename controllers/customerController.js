const Customer = require('../models/customer.js');
const { validateCustomer } = require('../utils/validate.js');


class CustomerController {

  getAll = async (req, res, next) => {
    try {
      const allCustomers = await Customer.find();
      res.send(allCustomers);
    }
    catch(exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  getOne = async (req, res, next) => {
    try {
      const requestedCustomer = await Customer.findById(req.params.id);
      if (!requestedCustomer) return next({ 'code': 404, 'log': 'Customer with given ID not found' });
      res.send(requestedCustomer);
    }
    catch(exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  createOne = async (req, res, next) => {
    const { value, error } = validateCustomer(req.body);
    if (error) return next({ 'code': 400, 'log': error['details'][0]['message'] });

    const { name, phone, isGold } = value;
    const newCustomer = new Customer({ name, phone, isGold });
    try {
      const saved = await newCustomer.save();
      res.send(saved);
    }
    catch(exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }


  updateOne = async (req, res, next) => {
    try {
      const requestedCustomer = await Customer.findById(req.params.id);
      if (!requestedCustomer) return next({ 'code': 404, 'log': 'Customer with given ID not found' });

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
      next({ 'code': 500, 'log': exc.message });
    }
  }


  deleteOne = async (req, res, next) => {
    try {
      const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
      if (!deletedCustomer) return next({ 'code': 404, 'log': 'Customer with given ID not found' });
      res.send(deletedCustomer);
    }
    catch(exc) {
      next({ 'code': 500, 'log': exc.message });
    }
  }

}


const customerController = new CustomerController();
module.exports = customerController;