const State = require("../models/State");
const Country = require("../models/Country");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidId, updateFields } = require("../utils/helpers");

// CREATE STATE
const createState = asyncHandler(async(req, res) => {
    const { name, country } = req.body;

    if (!name || !name.trim()) {
        throw new AppError("State name and country are required", 400);
    }

    if (!isValidId(country)) {
        throw new AppError("Invalid country ID", 400);
    }

    const countryExists = await Country.findById(country);

    if (!countryExists) {
        throw new AppError("Country not found", 404);
    }

    const trimmedName = name.trim();

    const existingState = await State.findOne({
        name: trimmedName,
        country,
    }).collation({ locale: "en", strength: 2 });

    if (existingState) {
        throw new AppError("State already exists in this country", 400);
    }

    const state = await State.create({
        name: trimmedName,
        country,
    });

    res.status(201).json({
        message: "State created successfully",
        state: await state.populate("country", "name"),
    });
});

// GET ALL STATES
const getStates = asyncHandler(async(req, res) => {
    const states = await State.find()
        .populate("country", "name")
        .sort({ name: 1 });

    res.status(200).json(states);
});

// GET STATES BY COUNTRY
const getStatesByCountry = asyncHandler(async(req, res) => {
    if (!isValidId(req.params.countryId)) {
        throw new AppError("Invalid country ID", 400);
    }

    const states = await State.find({
            country: req.params.countryId,
        })
        .populate("country", "name")
        .sort({ name: 1 });

    res.status(200).json(states);
});

// GET SINGLE STATE
const getStateById = asyncHandler(async(req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid state ID", 400);
    }

    const state = await State.findById(req.params.id).populate(
        "country",
        "name"
    );

    if (!state) {
        throw new AppError("State not found", 404);
    }

    res.status(200).json(state);
});

// UPDATE STATE
const updateState = asyncHandler(async(req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid state ID", 400);
    }

    const state = await State.findById(req.params.id);

    if (!state) {
        throw new AppError("State not found", 404);
    }

    const { name, country } = req.body;

    if (name !== undefined && !name.trim()) {
        throw new AppError("State name is required", 400);
    }

    if (country !== undefined) {
        if (!isValidId(country)) {
            throw new AppError("Invalid country ID", 400);
        }

        const countryExists = await Country.findById(country);

        if (!countryExists) {
            throw new AppError("Country not found", 404);
        }
    }

    const newName = name !== undefined ? name.trim() : state.name;

    const existing = await State.findOne({
        name: newName,
        country: country !== undefined ? country : state.country,
        _id: { $ne: state._id },
    }).collation({ locale: "en", strength: 2 });

    if (existing) {
        throw new AppError("State already exists in this country", 400);
    }

    updateFields(state, { name: newName, country }, ["name", "country"]);

    await state.save();

    res.status(200).json({
        message: "State updated successfully",
        state: await state.populate("country", "name"),
    });
});

// DELETE STATE
const deleteState = asyncHandler(async(req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid state ID", 400);
    }

    const state = await State.findByIdAndDelete(req.params.id);

    if (!state) {
        throw new AppError("State not found", 404);
    }

    res.status(200).json({
        message: "State deleted successfully",
    });
});

module.exports = {

    createState,
    getStates,
    getStatesByCountry,
    getStateById,
    updateState,
    deleteState,
};