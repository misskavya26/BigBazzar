const express = require('express');
const { createOrderController, getSingleOrderController, getAllOrderController, getAllOrderAdminController, updateOrderStockAdminController, deleteOrderAdminController } = require('../Controller/orderController');
const { authentication, authorized } = require('../middleware/auth');

const router = express.Router();

router.route('/order/create').post(authentication, createOrderController);

router.route('/order/:id').get(authentication, getSingleOrderController);

router.route('/orders/me').get(authentication, getAllOrderController);

router.route('/admin/orders').get(authentication, authorized('admin'), getAllOrderAdminController);

router.route('/admin/order/:id').put(authentication, authorized('admin'), updateOrderStockAdminController).delete(authentication, authorized('admin'), deleteOrderAdminController);

module.exports = router;