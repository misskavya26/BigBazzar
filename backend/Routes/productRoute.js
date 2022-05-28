const express = require('express');
const { getAllProducts, createProduct, getSingleProduct, updateProduct, deleteProduct, createProductReviewController, getProductReviewController, deleteProductReviewController } = require('../Controller/productController');
const { authentication, authorized } = require('../middleware/auth');

const router = express.Router();

router.route('/product').get(getAllProducts);
router.route('/admin/product/create').post(authentication, authorized('admin'), createProduct);
router.route('/admin/product/:id')
    .put(authentication, authorized('admin'), updateProduct)
    .delete(authentication, authorized('admin'), deleteProduct);
router.route('/product/:id').get(getSingleProduct)
router.route('/product/review').put(authentication, createProductReviewController);
router.route('/reviews').get(getProductReviewController).delete(authentication, deleteProductReviewController)

module.exports = router;