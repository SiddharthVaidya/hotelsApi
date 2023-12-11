const express = require('express');
const router = express.Router();
require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res) =>{
    const data = req.body
    data.password = await bcrypt.hash(data.password, 10);
    const dbresponse = await User.create(data)
    res.send(dbresponse)
})

router.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const dbUser = await User.findOne({username})
    const isCorrectPassword = await bcrypt.compare(password, dbUser.password);
    if(isCorrectPassword){
        const token = jwt.sign(
            {username: dbUser.username, isAdmin: dbUser.isAdmin},
            process.env.JWT_SECRET_KEY
        )
        res.send({token});
    }else{
        res.status(401).json({"messege": "Unauthorised"})
    }

})

module.exports = router