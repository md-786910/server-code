const router = require("express").Router();
const product = require("../model/product");
const Cart = require("../model/cart");


// CREATE
router.post('/', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = new Cart({ userId, productId, quantity });
        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ ONE
router.get('/:id', getCart, (req, res) => {
    res.json(res.cart);
});

// UPDATE
router.patch('/:id', getCart, async (req, res) => {
    if (req.body.userId != null) {
        res.cart.userId = req.body.userId;
    }
    if (req.body.productId != null) {
        res.cart.productId = req.body.productId;
    }
    if (req.body.quantity != null) {
        res.cart.quantity = req.body.quantity;
    }
    try {
        const updatedCart = await res.cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', getCart, async (req, res) => {
    try {
        await res.cart.remove();
        res.json({ message: 'Deleted cart' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getCart(req, res, next) {
    let cart;
    try {
        cart = await Cart.findById(req.params.id);
        if (cart == null) {
            return res.status(404).json({ message: 'Cannot find cart' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.cart = cart;
    next();
}