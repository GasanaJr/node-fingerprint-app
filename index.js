const express = require('express');
const mongoose = require('mongoose');
const userBio = require('./models/User');
const bodyParser = require('body-parser');
const FingerPrint = require('./models/FingerPrint');
require('dotenv').config();
const axios = require("axios");
const app = express();
const cors = require('cors')

// Middleware

// Increase the limit for JSON payloads
app.use(express.json({ limit: '50mb' }));  // Set this limit to what you expect your maximum payload size to be

// Increase the limit for URL-encoded form data
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())

try {
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("DB connected Successfully")
    })
} catch (error) {
    console.error(error);
}

app.get('/register', async (req, res) => {
    try {
        const dataToSend = { userId: '20 ' };
        const response = await axios.post('http://localhost:5212/fingerprint/register', dataToSend);
        res.json({message: response.data});
    } catch (error) {
        console.error('Error calling .NET API:', error.message);
        res.status(500).send('Failed to register fingerprint');
    }
});

app.post('/register', async(req,res) => {
    try {
        const user = new userBio(req.body);
        await user.save();
        res.status(201).json({Message: "User created successfully"});
    } catch (error) {
        console.log(error);
    }
})

app.get('/fingerprint', async (req, res) => {

});

function matchFingerprints(scannedTemplate, storedTemplate) {
    // This function would typically return a match score
    // For simplicity, we're just simulating a boolean response
    console.log(scannedTemplate)
    console.log("&&&&&&&&&&&&&&&&&&& End of Scanned Template &&&&&&&&&&&&&&")
    console.log(storedTemplate)
     return scannedTemplate == storedTemplate;
}

app.post('/match', async (req, res) => {
    const { fingerprintTemplate } = req.body;
    const scannedTemplate = fingerprintTemplate;

    try {
        const fingerprints = await FingerPrint.find();  // Fetch all fingerprints
        const matchFound = fingerprints.some(fp => matchFingerprints(scannedTemplate, fp.fingerprintTemplate));

        if (matchFound) {
            res.status(200).json({ message: "User exists" });
        } else {
            res.status(404).json({ message: "No matching user found" });
        }
    } catch (error) {
        console.error("Database or matching error: ", error);
        res.status(500).json({ message: "Error processing request" });
    }
});

app.get('/fingerprint', async(req,res) => {
    const users = await FingerPrint.find();
    return res.status(200).json({message: users});
})


app.listen(3000, () => {
    console.log("Server started");
});