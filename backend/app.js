const express = require('express');
const errorMiddleware = require('./middleware/error');
const productRouter = require('./Routes/productRoute');
const userRouter = require('./Routes/userRoute');
const orderRouter = require('./Routes/orderRoute');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

// -------------------------------------------PRODUCT ROUTES----------------------------------------
app.use('/api', productRouter);
app.use('/api', userRouter);
app.use('/api', orderRouter);

// -------------------------------------------ERROR MIDDLEWARE------------------------------------------
app.use(errorMiddleware);



module.exports = app;