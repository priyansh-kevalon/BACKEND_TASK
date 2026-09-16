const City = require("../models/City");
const State = require("../models/State");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidId, updateFields } = require("../utils/helpers");

// CREATE CITY
const createCity = asyncHandler(async (req, res) => {
    const { name, state } = req.body;

    if (!name || !name.trim()) {
        throw new AppError("City name and state are required", 400);
    }

    if (!isValidId(state)) {
        throw new AppError("Invalid state ID", 400);
    }

    const stateExists = await State.findById(state);

    if (!stateExists) {
        throw new AppError("State not found", 404);
    }

    const trimmedName = name.trim();

    const existingCity = await City.findOne({
        name: trimmedName,
        state,
    }).collation({ locale: "en", strength: 2 });

    if (existingCity) {
        throw new AppError("City already exists in this state", 400);
    }

    const city = await City.create({
        name: trimmedName,
        state,
    });

    res.status(201).json({
        message: "City created successfully",
        city: await city.populate({
            path: "state",
            select: "name country",
            populate: {
                path: "country",
                select: "name",
            },
        }),
    });
});

// GET ALL CITIES
const getCities = asyncHandler(async (req, res) => {
    const cities = await City.find()
        .populate({
            path: "state",
            select: "name country",
            populate: {
                path: "country",
                select: "name",
            },
        })
        .sort({ name: 1 });

    res.status(200).json(cities);
});

// GET CITIES BY STATE
const getCitiesByState = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.stateId)) {
        throw new AppError("Invalid state ID", 400);
    }

    const cities = await City.find({
            state: req.params.stateId,
        })
        .populate("state", "name")
        .sort({ name: 1 });

    res.status(200).json(cities);
});

// GET SINGLE CITY
const getCityById = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid city ID", 400);
    }

    const city = await City.findById(req.params.id).populate({
        path: "state",
        select: "name country",
        populate: {
            path: "country",
            select: "name",
        },
    });

    if (!city) {
        throw new AppError("City not found", 404);
    }

    res.status(200).json(city);
});

// UPDATE CITY
const updateCity = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid city ID", 400);
    }

    const city = await City.findById(req.params.id);

    if (!city) {
        throw new AppError("City not found", 404);
    }

    const { name, state } = req.body;

    if (name !== undefined && !name.trim()) {
        throw new AppError("City name is required", 400);
    }

    if (state !== undefined) {
        if (!isValidId(state)) {
            throw new AppError("Invalid state ID", 400);
        }

        const stateExists = await State.findById(state);

        if (!stateExists) {
            throw new AppError("State not found", 404);
        }
    }

    const newName = name !== undefined ? name.trim() : city.name;

    const existing = await City.findOne({
        name: newName,
        state: state !== undefined ? state : city.state,
        _id: { $ne: city._id },
    }).collation({ locale: "en", strength: 2 });

    if (existing) {
        throw new AppError("City already exists in this state", 400);
    }

    updateFields(city, { name: newName, state }, ["name", "state"]);

    await city.save();

    res.status(200).json({
        message: "City updated successfully",
        city: await city.populate({
            path: "state",
            select: "name country",
            populate: {
                path: "country",
                select: "name",
            },
        }),
    });
});

// DELETE CITY
const deleteCity = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid city ID", 400);
    }

    const city = await City.findByIdAndDelete(req.params.id);

    if (!city) {
        throw new AppError("City not found", 404);
    }

    res.status(200).json({
        message: "City deleted successfully",
    });
});

module.exports = {
    createCity,
    getCities,
    getCitiesByState,
    getCityById,
    updateCity,
    deleteCity,
};