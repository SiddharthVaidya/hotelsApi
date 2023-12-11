const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotelSchema')
const jwt = require('jsonwebtoken')



const jwt_helper = (req,res,next) =>{
    const token = req.headers.authorization;
    if(token){
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken
    }
    next()
}

router.use(jwt_helper);

//get request for all hotels
router.get('/', async (req,res) =>{
    const hotels = await Hotel.find()
    res.send(hotels)
})

//get request to fetch a single hotel by id
router.get('/:id', async (req, res) => {
    const selected = await Hotel.findById(req.params.id)
    res.send(selected)
})

//post request to add a new hotel to the list of hotels
router.post('/', async (req,res) =>{
    const received = req.body
    if(req.user && req.user.isAdmin === "true"){
    const dbresponse = await Hotel.create(received)
    res.send(dbresponse)
    }
    else{
        res.status(403).send({messege: "Forbidden"})
    }
})

module.exports = router; 