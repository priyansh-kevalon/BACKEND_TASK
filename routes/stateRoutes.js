const express = require("express");

const {
    createState,
    getStates,
    getStatesByCountry,
    getStateById,
    updateState,
    deleteState,
} = require("../controllers/stateController");

const router = express.Router();

router.post("/", createState);
router.get("/", getStates);
router.get("/country/:countryId", getStatesByCountry);
router.get("/:id", getStateById);
router.put("/:id", updateState);
router.delete("/:id", deleteState);

module.exports = router;