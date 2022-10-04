const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const {validateObjectId} = require('../validators/validateObjctId');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  if (!validateObjectId(subcategory, ctx)) {
    return;
  }

  const products = await Product.find({subcategory});

  const transformedProducts = products.map(mapProduct);

  ctx.body = {
    products: transformedProducts,
  };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  const transformedProducts = products.map(mapProduct);

  ctx.body = {
    products: transformedProducts,
  };
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!validateObjectId(id, ctx)) {
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.status = 404;
    return;
  }

  const transformedProducts = mapProduct(product);

  ctx.body = {
    product: transformedProducts,
  };
};

