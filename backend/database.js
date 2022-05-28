const mongoose = require('mongoose');

const databaseConnect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        // useUnifiedToplogy: true,
        // useCreateIndex: true
    }).then((data) => {
        console.log(`MongoDB is connected on server : ${data.connection.host}`);
    });
}

module.exports = databaseConnect;