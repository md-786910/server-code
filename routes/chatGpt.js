const { Configuration, OpenAIApi } = require("openai");

const router = require("express").Router();


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
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: para }],
        });
        const resp = completion.data.choices[0].message;
        res.status(200).json({ resp: resp, success: true });

    } catch (error) {

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
