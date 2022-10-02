const mongoose = require('mongoose');
const connection = require('../libs/connection');

const {Schema} = mongoose;

const subCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subcategories: [subCategorySchema],
});

module.exports = connection.model('Category', categorySchema);
