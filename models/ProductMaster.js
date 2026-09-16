const mongoose = require("mongoose");

const productMasterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    image: {
        type: String,
        default: "",
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },

    categoryId: {
        type: String,
        default: "",
    },

    description: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("ProductMaster", productMasterSchema);