const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
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
            type: String,
            required: true,
        },
        qty: {
            type: String,
            required: true,

        },
        cart: {
            type: Array,
            required: false,
        }
    },
    {
        timestamps: true
    }
);

const cart = mongoose.model("cart", cartSchema);
module.exports = cart;
