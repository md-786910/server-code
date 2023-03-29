const express = require("express");
const cors = require("cors");
const consola = require("consola");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const fileUpload = require("express-fileupload");
const app = express();

// How to Train an AI Chatbot With Custom large Knowledge Base in pdf format about NFT Using ChatGPT API using node js

// config dotenv
dotenv.config({});
const productRoutes = require("./routes/productRoute")
const chatGptRoutes = require("./routes/chatGpt")
const quotationRoutes = require("./routes/quotationRoute")
const corsOptions = {
    origin: "*", //included origin as true
    credentials: true, //included credentials as true
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(fileUpload({
    useTempFiles: true,
}))

// Routes
app.use(productRoutes);
app.use(chatGptRoutes);
app.use(quotationRoutes);

const runDb = async () => {
    try {
        const DB = process.env.NODE_ENV === 'production' ? process.env.DB_URI : process.env.DB_URI_LOCAL;


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

