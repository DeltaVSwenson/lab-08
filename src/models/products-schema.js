'use strict';

const mongoose = require('mongoose');

// What fields and constraints do we want?
const products = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},


});

// Do we need to run any lifecycle hooks/middleware?

module.exports = mongoose.model('products ', products);
