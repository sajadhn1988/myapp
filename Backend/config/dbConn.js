const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        //console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;
