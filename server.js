const express = require('express');
require('dotenv').config()
const hotel = require('./routes/hotels')
const user = require('./routes/users')
const mongoose = require('mongoose')

const app = express();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});


//implementing a logger for logging request
const logger = ((req, res, next) =>{
    console.log(`${req.method} received on ${req.url}`);
    next();
})

app.use(logger);
app.use(express.json());
app.use("/api/hotels",hotel)
app.use("/api/hotels", user)

//app will listen on this port
app.listen(process.env.PORT , () => {
    console.log(`Server up and running on port ${process.env.port}`);
})