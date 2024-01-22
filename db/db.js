const mongoose = require('mongoose');

//Configuring database
const connectDB = async() => {
    await mongoose.connect('mongodb://0.0.0.0:27017/mentor-assign-app',{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    console.log('Connected to mongodb...')
}

module.exports = connectDB;