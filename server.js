// ./server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

//Routes files
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3500;

const allowedOrigins = [
    process.env.BASE_URL,
    process.env.FRONTEND_URL
].filter(Boolean);


connectDB();

app.use(cors({
    origin: allowedOrigins,
    credentials: true // So Cookies pass through 
}));

app.use(express.json());
app.use(cookieParser());

// Routes

// to show a test message at http://127.0.0.1:3500/test
app.get('/test', (req, res) => {
  res.send("This is a test");
});
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
