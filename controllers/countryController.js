const Country = require("../models/Country");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidId } = require("../utils/helpers");

// CREATE COUNTRY
const createCountry = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
        throw new AppError("Country name is required", 400);
    }

    const trimmedName = name.trim();

    const existingCountry = await Country.findOne({
        name: trimmedName,
    }).collation({ locale: "en", strength: 2 });

    if (existingCountry) {
        throw new AppError("Country already exists", 400);
    }

    const country = await Country.create({
        name: trimmedName,
    });

    res.status(201).json({
        message: "Country created successfully",
        country,
    });
});

// GET ALL COUNTRIES
const getCountries = asyncHandler(async (req, res) => {
    const countries = await Country.find().sort({ name: 1 });

    res.status(200).json(countries);
});

// GET SINGLE COUNTRY
const getCountryById = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid country ID", 400);
    }

    const country = await Country.findById(req.params.id);

    if (!country) {
        throw new AppError("Country not found", 404);
    }

    res.status(200).json(country);
});

// UPDATE COUNTRY
const updateCountry = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid country ID", 400);
    }

    const country = await Country.findById(req.params.id);

    if (!country) {
        throw new AppError("Country not found", 404);
    }

    const { name } = req.body;

    if (name !== undefined) {
        if (!name.trim()) {
            throw new AppError("Country name is required", 400);
        }

        const trimmedName = name.trim();

        const existing = await Country.findOne({
            name: trimmedName,
            _id: { $ne: country._id },
        }).collation({ locale: "en", strength: 2 });

        if (existing) {
            throw new AppError("Country already exists", 400);
        }

        country.name = trimmedName;
    }

    await country.save();

    res.status(200).json({
        message: "Country updated successfully",
        country,
    });
});

// DELETE COUNTRY
const deleteCountry = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid country ID", 400);
    }

    const country = await Country.findByIdAndDelete(req.params.id);

    if (!country) {
        throw new AppError("Country not found", 404);
    }

    res.status(200).json({
        message: "Country deleted successfully",
    });
});

module.exports = {
    createCountry,
    getCountries,
    getCountryById,
    updateCountry,
    deleteCountry,
};