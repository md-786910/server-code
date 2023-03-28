const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
    {
        link: {
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
