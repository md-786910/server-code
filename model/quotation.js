const mongoose = require("mongoose");
let count = 1;
const quotationSchema = new mongoose.Schema(
    {
        serial: {
            type: Number,
            required: false,
            default: count++
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
