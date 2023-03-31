const router = require("express").Router();
const quotation = require("../model/quotation");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require('path')
var { pick } = require('lodash');

const pdfMake = require('pdfmake');
const htmlToPdfmake = require('html-to-pdfmake');
const product = require("../model/product");
const ejs = require("ejs");

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


// endpoint to generate and upload pdf
let count = 1;
router.get('/generate-pdf', (req, res) => {
    // create html content
    const htmlContent = '<h1>Hello, World!</h1>';

    // generate pdf from html
    pdf.create(htmlContent).toFile('public/pdf/output.pdf', (err, result) => {
        if (err) {
            console.log(err);
           res.status(500).json({ data: "Error generating PDF from createPdf", success: false });
            return;
        }

        // upload pdf to cloudinary
        cloudinary.uploader.upload('public/pdf/output.pdf', { resource_type: 'raw' }, async (error, result) => {
            if (error) {
                console.log(error);
              res.status(500).json({ data: "Error uploading PDF from cloudinary", success: false });
                return;
            }

            // delete local pdf file
            // fs.unlinkSync('./public/pdf/output.pdf');

            //  return public URL of uploaded pdf

            const quotationInst = new quotation({
                serial: count++,
                cloudinaryUrl: result.secure_url
            })
            const saveData = await quotationInst.save()
            res.status(201).json({ data: saveData, success: true })

        });
    });
});


router.get("/getQuotation", async (req, res, next) => {
    try {
        const saveData = await quotation.find({}).sort({ _id: -1 });
        res.status(200).json({ data: saveData, success: true })

    } catch (error) {
        res.status(404).json({ data: error, success: false })
    }
})


// generate json to pdf
router.get('/jsontopdf', async (req, res) => {
    try {
        const users = await product.find({})

        const data = {
            users: users
        }

        const filePathName = path.resolve(__dirname, '../views/pdf1.ejs');
        const htmlString = fs.readFileSync(filePathName).toString();

        const hbsData = ejs.render(htmlString, data);

        // Options for the PDF generation
        const options = { format: 'Letter' };

        // Generate the PDF
        pdf.create(hbsData).toFile('public/pdf/cart.pdf', (err, result) => {
            if (err) {
                console.log(err);
                  res.status(500).json({ data: "Error generating PDF from cart", success: false });
                return;
            }
        })

        pdf.create(hbsData, options).toStream((err, stream) => {
            if (err) return res.send(err);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=file.pdf');
            stream.pipe(res);
        });

    } catch (error) {
        res.status(500).json({ data: error, success: false })
    }
});





module.exports = router;

/*write an api that will generate a PDF template
 based on data passed in request using and express js and mongodb also store pdf on cloudanary and create new document model called quotation and store cloudinary link there.  */
