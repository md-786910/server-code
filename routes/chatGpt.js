const { Configuration, OpenAIApi } = require("openai");
const router = require("express").Router();
const product = require("../model/product");

// Configuration 

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// async function example() {
//     const api = new ChatGPTAPI1({
//         model: "gpt-3.5-turbo",
//         apiKey: process.env.OPENAI_API_KEY
//     })

//     const res = await api.sendMessage('Hello World!')
//     console.log(res.text)
// }
// example();

// chat gpt
router.post("/chat", async (req, res) => {
    try {
        const { para } = req.body;
        // Generate a response with the OpenAI API
        const flightData = await product.find();

        const tablefields = [
            "productName",
            "description",
            "image",
            "price",
            "qty",
        ];

        const flightDataString = flightData
            .map(
                (flight) =>
                    `${flight.productName}, ${flight.description}, ${flight.image}, ${flight.price}, ${flight.qty}`
            )
            .join("\n");

        const tableFieldsString = tablefields.join(", ");

        const query = `${para}\nuse only following data to answer\n\n${tableFieldsString}\n${flightDataString}`;

        // console.log("query", query);

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 2000,
            temperature: 1,
            stream: false,
            messages: [
                {
                    role: "user",
                    content: query,
                },
            ],
        });

        const resp = response.data.choices[0].message;
        res.status(200).json({ resp: resp, success: true });

    } catch (error) {
        res.status(404).json({ message: "Api expired", success: false });
    }
});

router.get("/", async (req, res) => {
    try {
        res.status(200).json({ resp: "Hi server ", success: true });
    } catch (error) {
        res.status(200).json({ resp: error, success: true });

    }
});

module.exports = router;
