const mongoose = require('mongoose');


//function to connect to DB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/toodolistapp', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

require('./models/lists');
require('./models/users');

module.exports = connectDB;