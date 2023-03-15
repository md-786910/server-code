const express = require("express");
const cors = require("cors");
const consola = require("consola");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const fileUpload = require("express-fileupload");
const app = express();


// config dotenv

dotenv.config({});

const VideRoutes = require("./routes/productRoute")
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(fileUpload({
    useTempFiles: true,
}))

// Routes
app.use(VideRoutes);

const runDb = async () => {
    try {
        const DB = process.env.DB_URI;
        mongoose.set("strictQuery", false);
        await mongoose.connect(DB, { useUnifiedTopology: false });
        consola.success("connected to MongoDB");

        app.listen(port, async () => {
            consola.success("app is running on port " + port);
        });
    } catch (error) {
        console.log("connection error" + error.message);
    }
};
runDb();

