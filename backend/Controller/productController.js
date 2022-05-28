const Product = require('../Models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');
const apiFeature = require('../utils/apiFeature');

// ------------------------------------------CREATE PRODUCT- ADMIN------------------------------------------
const createProduct = asyncHandler(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

// ------------------------------------------GET ALL PRODUCT -----------------------------------------------
const getAllProducts = asyncHandler(async (req, res) => {

    let productCount = await Product.countDocuments();

    let numofpage = 5;
    let apifeature = new apiFeature(Product.find(), req.query)
        .search()
        .filter()
        .pagination(numofpage);
    const products = await apifeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount
    });
})
// ------------------------------------------GET SINGLE PRODUCT -------------------------------------------
const getSingleProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Doesn't Exist", 404));
    };

    res.status(200).json({
        success: true,
        product,
    });
});
// ------------------------------------------UPDATE PRODUCT- ADMIN------------------------------------------
const updateProduct = asyncHandler(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Doesn't Exist", 404));
    };

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    });
});

// ------------------------------------------DELETE PRODUCT- ADMIN-----------------------------------------
const deleteProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Doesn't Exist", 404));
    };

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
});

// ---------------------------- CREATE PRODUCT REVIEW / UPDATE PRODUCT REVIEW -----------------------------
const createProductReviewController = asyncHandler(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReview = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => avg += rev.rating);

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

// ----------------------------------- GET ALL PRODUCT REVIEWS -----------------------------------
const getProductReviewController = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler('Product not Found', 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// ----------------------------------- DELETE PRODUCT REVIEW ------------------------------------
const deleteProductReviewController = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler('Product not Found', 404));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach((rev) => avg += rev.rating);

    const ratings = avg / reviews.length;

    const numOfReview = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, numOfReview
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })
})

module.exports = { getAllProducts, createProduct, getSingleProduct, updateProduct, deleteProduct, createProductReviewController, getProductReviewController, deleteProductReviewController };