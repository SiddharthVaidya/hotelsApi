const mongoose = require('mongoose')

const user = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: String
})

const userSchema = mongoose.model('User', user)

module.exports = userSchema;