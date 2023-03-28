const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        product_id: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        qty: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

const cart = mongoose.model("cart", cartSchema);
module.exports = cart;
