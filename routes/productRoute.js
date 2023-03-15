const router = require("express").Router();
const product = require("../model/product");
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const CLOUD_NAME = process.env.CLOUD_NAME
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

// Configuration 
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

router.post("/addProduct", async (req, res) => {
    try {

        const { productName, description, price, qty } = req.body;
        const { image } = req.files;
        const result1 = await cloudinary.uploader.upload(image.tempFilePath)
        // const result2 = await cloudinary.uploader.upload(video.tempFilePath,
        //     {
        //         resource_type: "video",
        //         public_id: "myfolder/mysubfolder/dog_closeup",
        //         chunk_size: 6000000,
        //         eager: [
        //             { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        //             { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
        //         eager_async: true,
        //     })
        // if (result2.url) {
        const instanceObj = new product({
            productName: productName,
            description: description,
            image: result1.url,
            price: price,
            qty: qty,
        })
        await instanceObj.save();
        res.status(201).json({ message: "uploaded successfully!", success: true });



    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "uploading error!" });
    }
});

// get product
router.get("/getProduct", async (req, res) => {
    try {
        const prod = await product.find({})
        res.status(200).json({ data: prod, success: true })
    } catch (error) {
        res.status(404).json({ message: "product error!", success: false });

    }
})
router.post("/getProductById", async (req, res) => {
    try {
        const { id } = req.body
        const prod = await product.findById(id)
        res.status(200).json({ data: prod, success: true })
    } catch (error) {
        res.status(404).json({ message: "product error!", success: false });

    }
})


router.post("/deleteProduct", async (req, res) => {
    try {
        const { id } = req.body
        console.log(id);
        const prod = await product.findByIdAndDelete({ _id: id })
        res.status(200).json({ data: prod, success: true })
    } catch (error) {
        res.status(404).json({ message: "product error!", success: false });

    }
})

router.put("/editProduct", async (req, res) => {
    try {
        const { id, productName, description, price, qty } = req.body
        console.log(req.body);

        const { image } = req.files;
        const result1 = await cloudinary.uploader.upload(image.tempFilePath)

        const updatedResult = await product.findByIdAndUpdate(
            { _id: id },
            {
                productName: productName,
                description: description,
                image: result1.url,
                price: price,
                qty: qty,
            },
            {
                new: true,
                upsert: true,

            }
        );
        console.log(updatedResult);

        res.status(200).json({ data: updatedResult, success: true })
    } catch (error) {
        res.status(404).json({ message: "product error!", success: false });

    }
})


// admin routing
router.get("/", (req, res) => {
    res.status(200).json({ message: "server fine" });
});



module.exports = router;
