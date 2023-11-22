const express = require('express');
const app = express();
app.use(express.json());  // Middleware for parsing JSON bodies

const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

app.post('/analyze', async (req, res) => {
    const text = req.body.text;

    // Prepare document for the Natural Language API
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    try {
        // Detects the sentiment of the text
        const [result] = await client.analyzeSentiment({document: document});
        const sentiment = result.documentSentiment;

        // Send the sentiment analysis result back
        res.json(sentiment);
    } catch (error) {
        console.error('ERROR:', error);
        // Send a JSON-formatted error response
        res.status(500).json({ error: 'Error in analyzing sentiment', details: error.message });
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
