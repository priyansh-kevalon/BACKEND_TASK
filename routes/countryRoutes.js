const express = require("express");

const {
    createCountry,
    getCountries,
    getCountryById,
    updateCountry,
    deleteCountry,
} = require("../controllers/countryController");

const router = express.Router();

router.post("/", createCountry);
router.get("/", getCountries);
router.get("/:id", getCountryById);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);

module.exports = router;