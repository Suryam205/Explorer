const dotenv = require('dotenv');
dotenv.config(); // ✅ This loads your .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDb = require('./Mongodb/connectDb');
const userRoutes = require('./Routes/user');
const cookieParser = require('cookie-parser');
const uploadRoutes = require('./Routes/addFeed');
const path = require('path');
const commentRoutes = require('./Routes/comment');


// Initialize express app
const app = express();
const port =  process.env.PORT || 8000;


app.use(cors({
  origin: "http://localhost:5173",  // Your frontend origin
  credentials: true                 // Allow cookies/auth headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Connect to MongoDB
connectDb();

//  Serve static files from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




// Define routes
app.use('/user' , userRoutes);
app.use('/', uploadRoutes);
app.use('/comments', commentRoutes )


app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploadsProfiles', express.static(path.join(__dirname, 'uploadsProfiles')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


module.exports = app;


