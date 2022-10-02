const mongoose = require('mongoose');
const connection = require('../libs/connection');

const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: ObjectId,
    required: true,
    ref: 'Category',
  },
  subcategory: {
    type: ObjectId,
    required: true,
  },
  images: [String],
});

module.exports = connection.model('Product', productSchema);
