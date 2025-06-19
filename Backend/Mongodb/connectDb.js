const mongoose = require('mongoose');

const connectDb= async()=>{
    try {
        await mongoose.connect(process.env.MongoDb_URI, {
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

module.exports = connectDb;