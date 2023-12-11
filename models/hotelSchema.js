const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: String,
    price: Number,
    state: String,
    city: String,
    rating: Number
})

const hotel = mongoose.model('Hotel', hotelSchema)

module.exports = hotel;