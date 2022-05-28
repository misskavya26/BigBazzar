const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please Enter Product Name'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Please Enter Product Description'],
        },
        price: {
            type: Number,
            required: [true, 'Please Enter Product Price'],
            maxlength: [8, "Price cannot exceed 8 characters"]
        },
        ratings: {
            type: Number,
            default: 0
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        category: {
            type: String,
            required: [true, 'Please Enter Product Category']
        },
        stock: {
            type: Number,
            maxlength: [4, "Stock cannot exceed 4 characters"],
            required: [true, 'Please Enter Product Stock'],
            default: 1
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        numOfReview: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    });

const Product = new mongoose.model('Product', productSchema);

module.exports = Product;