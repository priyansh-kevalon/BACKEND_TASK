const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },

    productImage: {
        type: String,
        default: "",
    },

    productDescription: {
        type: String,
        default: "",
    },

    price: {
        S: {
            type: Number,
            default: 0,
        },

        M: {
            type: Number,
            default: 0,
        },

        L: {
            type: Number,
            default: 0,
        },
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);