const mongoose = require("mongoose");

const isValidId = (id) => mongoose.isValidObjectId(id);

const updateFields = (doc, body, fields) => {
    fields.forEach((field) => {
        if (body[field] !== undefined) {
            doc[field] = body[field];
        }
    });
    return doc;
};

module.exports = { isValidId, updateFields };