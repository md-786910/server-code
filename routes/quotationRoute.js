const router = require("express").Router();
const quotation = require("../model/quotation");


// CREATE
router.post('/quotation', async (req, res) => {
    try {
        const { link } = req.body;
        const quotation = new quotation({ link: link });
        await quotation.save();
        res.status(201).json(quotation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ ALL
router.get('/getQuotation', async (req, res) => {
    try {
        const quotations = await quotation.find();
        res.json(quotations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ ONE
router.post('/getQuotationById', getquotation, (req, res) => {
    res.json(res.quotation);
});

// UPDATE
router.patch('/updateQuotationById', getquotation, async (req, res) => {
    if (req.body.link != null) {
        res.quotation.link = req.body.link;
    }
    try {
        const updatedquotation = await res.quotation.save();
        res.json(updatedquotation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/deleteQuotationById', getquotation, async (req, res) => {
    try {
        await res.quotation.remove();
        res.json({ message: 'Deleted quotation' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getquotation(req, res, next) {
    let quotation;
    try {
        quotation = await quotation.findById(req.body.id);
        if (quotation == null) {
            return res.status(404).json({ message: 'Cannot find quotation' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.quotation = quotation;
    next();
}
module.exports = router;