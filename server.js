// ./server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const app = express();
const PORT = process.env.PORT || 3500;


connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL, // Ensure this matches your client URL
    credentials: true, // Allow cookies to be sent and received
})); 

app.use(express.json());
app.use(cookieParser());



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
