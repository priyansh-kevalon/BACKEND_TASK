const express = require("express");

const {
    createCity,
    getCities,
    getCitiesByState,
    getCityById,
    updateCity,
    deleteCity,
} = require("../controllers/cityController");

const router = express.Router();

router.post("/", createCity);
router.get("/", getCities);
router.get("/state/:stateId", getCitiesByState);
router.get("/:id", getCityById);
router.put("/:id", updateCity);
router.delete("/:id", deleteCity);

module.exports = router;