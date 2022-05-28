const express = require('express');
const app = require('./app');
const dotenv = require('dotenv');
const databaseConnect = require('./database');

// -----------------------------------------UNCAUGHT EXCEPTION ERROR---------------------------------------
process.on('uncaughtException', (err) => {
    console.log(`Error : ${err}`);
    console.log('Server close due to Uncaught Exception');
    process.exit(1);
})

// ------------------------------------------for .env file-----------------------------------------
dotenv.config({ path: 'backend/config/config.env' })

// ------------------------------------------DATBASE CONNECT------------------------------------------
databaseConnect();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})

// -----------------------------------UNHANDLED PROMISE REJECTION----------------------------------------------
process.on('unhandledRejection', (err) => {
    console.log(`Error : ${err}`);
    console.log('Server close due to unhandled promise rejection');

    server.close(() => {
        process.exit(1);
    })
})