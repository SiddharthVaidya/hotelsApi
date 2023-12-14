const express = require("express");
const router = express.Router();
const Hotel = require("../models/hotelSchema");
const jwt = require("jsonwebtoken");

const jwt_helper = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
  }
  next();
};

const isAdmin = (req, res, next) => {
  const decoded = req.user;
  if (decoded && decoded.isAdmin === "true") {
    next();
  } else {
    res.status(403).send({ messege: "Forbidden" });
  }
};

router.use(jwt_helper);

//get request for all hotels with pagination {page, pageSize} also search by city implemented
router.get("/", async (req, res) => {
    try {
      if (req.query.page && req.query.pageSize) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 2;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const data = await Hotel.aggregate([
          { $skip: skip },
          { $limit: limit },
        ]);
        const totalCount = await Hotel.countDocuments();
        res.json({ data, totalCount });
      } else if (req.query.city) {
        const city = String(req.query.city);
        const data = await Hotel.find({
          city: city,
        });
        res.json({ message: "Hotel fetched successfully", data });
      } else {
        const hotels = await Hotel.find();
        res.json({ message: "Hotels fetched successfully", hotels });
      }
    } catch (err) {
      res.status(500).send({ message: "Internal server error" });
    }
});

//get request to fetch a single hotel by id
router.get("/:id", async (req, res) => {
  try {
    const selected = await Hotel.findById(req.params.id);
    res.send(selected);
  } catch (err) {
    res.status(404).send({ message: "Invalid Hotel ID" });
  }
});

//post request to add a new hotel to the list of hotels
router.post("/", isAdmin, async (req, res) => {
    try{
  const received = req.body;
  if(!received || !received.name || !received.city || !received.state || !received.rating || !received.price){
    res.status(400).send({message:"Bad Request"})
  }else{
  const dbresponse = await Hotel.create(received);
  res.send(dbresponse);
  }
}catch(err){
    res.status(503).json({message: "Internal Server Error"})
}
});

//put request to update hotels
router.put("/:id", isAdmin, async (req, res) => {
    try {
      const received = req.body;
      const dbresponse = await Hotel.findByIdAndUpdate(req.params.id, received);
      const updatedHotel = await Hotel.findById(req.params.id);
      res.send({ messege: "Hotel Updated Successfully.", updatedHotel });
    } catch (err) {
      res.status(404).send({ message: "Invalid Hotel ID" });
    }
});

//delete request to delete a hotel by ID
router.delete("/:id", isAdmin, async (req, res) => {
    try {
      const existingData = await Hotel.findById(req.params.id);
      if (!existingData) {
        return res
          .status(404)
          .send({ messege: "Requested Hotel does not exist in database" });
      }
      const dbresponse = await Hotel.findByIdAndDelete(req.params.id);
      const newData = await Hotel.findById(req.params.id);
      if (!newData) {
        res.status(200).send({ messege: "Hotel Deleted Successfully." });
      }
    } catch (err) {
      res.status(503).send({ messege: "Internal server error" });
    }
});

module.exports = router;
