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
const cart = require("../model/cart");

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
const pdfPath = path.join(__dirname, "../public/pdf/output.pdf")

const htmpFilePath = fs.readFileSync(path.join(__dirname, "../public/pdf.html"))

router.get('/generate-pdf', (req, res) => {
    // create html content

    // generate pdf from html
    pdf.create(`${htmpFilePath}`, {
        childProcessOptions: {
            env: {
                OPENSSL_CONF: '/dev/null',
            },
        }
    }).toFile(pdfPath, (err, result) => {
        if (err) {
            console.log(err);

            res.status(500).json({ data: "Error generating PDF from createPdf", success: false });

            return;
        }

        // upload pdf to cloudinary
        cloudinary.uploader.upload(pdfPath, { resource_type: 'raw' }, async (error, result) => {
            if (error) {
                console.log(error);

                res.status(500).json({ data: "Error uploading PDF from cloudinary", success: false });
                return;
            }
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
// router.get('/jsontopdf', async (req, res) => {
//     try {
//         const users = await cart.find({})

//         const data = {
//             users: users
//         }

//         const pdfJsonPath = path.join(__dirname, "../public/pdf/cart.pdf")
//         const filePathName = path.resolve(__dirname, '../views/pdf1.ejs');
//         const htmlString = fs.readFileSync(filePathName).toString();

//         const hbsData = ejs.render(htmlString, data);

//         // Options for the PDF generation
//         const options = { format: 'A4' };

//         // // Generate the PDF
//         // pdf.create(hbsData, {
//         //     childProcessOptions: {
//         //         env: {
//         //             OPENSSL_CONF: '/dev/null',
//         //         },
//         //     },
//         //     width: "100%"
//         // }).toFile(pdfJsonPath, (err, result) => {
//         //     if (err) {
//         //         console.log(err);
//         //         res.status(500).json({ data: "Error generating PDF from cart", success: false });

//         //     }
//         // })

//         pdf.create(hbsData, options).toStream((err, stream) => {
//             if (err) return res.send(err);
//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('Content-Disposition', 'attachment; filename=qoute.pdf');
//             stream.pipe(res);
//         });

//     } catch (error) {
//         res.status(500).json({ data: error, success: false })
//     }
// });


router.get('/jsontopdf-1', async (req, res) => {
    const carts = await cart.find({})

    const doc = new PDFDocument();

    const table = {
        headers: ['Product Name', 'Qty', 'Price'],
        rows: carts?.map(item => {
            return [item.productName, item.qty, '₹' + item.price.toLocaleString('en-IN')]
        }),
        total: '₹' + carts?.reduce((total, item) => total + item.price * item.qty, 0).toLocaleString('en-IN')
    }


    // Add the table headers
    doc.font('Helvetica-Bold');
    doc.fontSize(12);
    table.headers.forEach((header, i) => {
        doc.text(header, 50 + i * 150, 150);
    });

    // Add the table rows
    doc.font('Helvetica');
    doc.fontSize(10);
    table.rows.forEach((row, i) => {
        row.forEach((cell, j) => {
            doc.text(cell, 50 + j * 150, 180 + i * 30);
        });
    });

    // Add the total price
    doc.font('Helvetica-Bold');
    doc.fontSize(12);
    doc.text('Total:', 50, 180 + table.rows.length * 30);
    doc.text(table.total, 200, 180 + table.rows.length * 30);

    doc.pipe(fs.createWriteStream(pdfPath));
    doc.end();

    // upload pdf to cloudinary
    cloudinary.uploader.upload(pdfPath, { resource_type: 'raw' }, async (error, result) => {
        if (error) {
            console.log(error);

            res.status(500).json({ data: "Error uploading PDF from cloudinary", success: false });
            return;
        }
        const quotationInst = new quotation({
            serial: count++,
            cloudinaryUrl: result.secure_url
        })
        const saveData = await quotationInst.save()
        res.status(201).json({ data: saveData, success: true })

    });
});






module.exports = router;

/*write an api that will generate a PDF template
 based on data passed in request using and express js and mongodb also store pdf on cloudanary and create new document model called quotation and store cloudinary link there.  */
