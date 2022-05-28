const Order = require('../Models/orderModel');
const Product = require('../Models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

// ----------------------------------------- CREATE A ORDER ITEM -----------------------------------
const createOrderController = asyncHandler(async (req, res, next) => {

    const { shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    })
})

// ---------------------------------- GET ONE ORDER FOR LOGGED IN USER -----------------------------------
const getSingleOrderController = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ErrorHandler('Order is not found with this id', 404));
    }

    res.status(200).json({
        success: true,
        order
    });
})

// --------------------------------- GET ALL ORDER FOR LOGGED IN USER ----------------------------
const getAllOrderController = asyncHandler(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    });
})

// --------------------------------- GET ALL ORDERS FOR -- ADMIN ----------------------------------------
const getAllOrderAdminController = asyncHandler(async (req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
})

// ----------------------------- UPDATE ORDER STATUS, PRODUCT STOCK ------------------------------
const updateOrderStockAdminController = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        next(new ErrorHandler("Order has not Found with this id", 404));
    }

    if (order.orderStatus == 'Delivered') {
        next(new ErrorHandler("You already Delivered this order", 400));
    }



    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

// ----------------------------------- DELETE ORDER FOR ADMIN --------------------------------
const deleteOrderAdminController = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order Not Found with this Id', 404));
    }

    await order.remove();

    res.status(200).json({
        success: true
    });
})

module.exports = { createOrderController, getSingleOrderController, getAllOrderController, getAllOrderAdminController, updateOrderStockAdminController, deleteOrderAdminController };