const router = require("express").Router();
const quotation = require("../model/quotation");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require('path')

const cloudinary = require("cloudinary").v2;
const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;


// Configuration
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

// const pdf1 = path.join(__dirname, "../pdf/qoute.pdf");
// console.log(pdf1);

// console.log(fs.readFileSync(pdf1, "utf8").toLocaleString());

router.get("/getQuotation", async (req, res) => {
    try {
        let htmlContent = "<html><body><h1>Hello World</h1></body></html>";
        pdf.create(htmlContent).toFile('./output.pdf', function (err, res) {
            if (err) return res.status(404).json({ data: "error to create pdf file", success: false });
            console.log(res);
        });


        const alreadyExist = await quotation.findOne({ title: "pdf" });
        if (alreadyExist) {
            res.status(201).json({ data: alreadyExist.cloudinaryUrl, success: true })

        }
        else {
            cloudinary.uploader.upload('./output.pdf', async function (error, result) {
                if (error) res.status(404).json({ data: "error uploading to cloudinary", success: false });

                const quotationInst = new quotation({
                    title: "pdf",
                    cloudinaryUrl: result.secure_url
                })

                const saveData = await quotationInst.save()
                // console.log(saveData);
                res.status(201).json({ data: saveData.cloudinaryUrl, success: true })

            });

        }


    } catch (error) {
        res.status(404).json({ data: error, success: false })
    }

})


module.exports = router;

/*write an api that will generate a PDF template
 based on data passed in request using and express js and mongodb also store pdf on cloudanary and create new document model called quotation and store cloudinary link there.  */
