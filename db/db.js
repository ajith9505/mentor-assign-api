const mongoose = require('mongoose');
require("dotenv").config();

//Configuring database
const connectDB = async() => {
    await mongoose.connect(process.env.DB_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    console.log('Connected to mongodb...')
}

module.exports = connectDB;