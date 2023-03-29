const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: false,
            default: ""
        },
        cloudinaryUrl: {
            type: String,
            required: false
        },

    },
    {
        timestamps: true
    }
);

const quotation = mongoose.model("quotation", quotationSchema);
module.exports = quotation;
