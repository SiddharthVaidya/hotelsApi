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

//get request for all hotels
router.get("/", async (req, res) => {
  const hotels = await Hotel.find();
  res.send(hotels);
});

//get request to fetch a single hotel by id
router.get("/:id", async (req, res) => {
  const selected = await Hotel.findById(req.params.id);
  res.send(selected);
});

//post request to add a new hotel to the list of hotels
router.post("/", isAdmin, async (req, res) => {
  const received = req.body;
  const dbresponse = await Hotel.create(received);
  res.send(dbresponse);
});

//put request to update hotels
router.put("/:id", isAdmin, async (req, res) => {
  const received = req.body;
  const existingData = await Hotel.findById(req.params.id);
  if (!existingData) {
    return res
      .status(404)
      .send({ messege: "Requested Hotel does not exist in database" });
  }
  const dbresponse = await Hotel.findByIdAndUpdate(req.params.id, received);
  const newData = await Hotel.findById(req.params.id);
  res.send(newData);
});

//delete request to delete a hotel by ID
router.delete("/:id", isAdmin, async (req, res) => {
  const received = req.body;

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
  } else {
    res.status(503).send({ messege: "Internal server error" });
  }
});

module.exports = router;
