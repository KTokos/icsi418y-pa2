require("dotenv").config();

// ---------- Setup Code ----------

// Import MongoClient and create a MongoDB client
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

const express = require("express");
const cors = require("cors");

const app = express();

// Allows Express to read JSON sent by the React application
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

app.listen(9000, () => {
    console.log("Server running on port 9000");
});

// Function to test MongoDB connection
async function connectDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB");
        console.error(error);
    }
}

// Connect to the database
connectDatabase();

// Select a database and a collection
const db = client.db("pa2");
const users = db.collection("users");

// ---------- App Logic ----------

// Function to recieve POST requests at signup endpoint
app.post("/api/signup", async (req, res) => {
    const formData = req.body;

    // Log data for testing
    // console.log(formData);

    // Verify that all information was recieved
    if (formData.firstName === '') {
        res.status(400).json({
            message: "First name is required."
        });

        return;
    } else if (formData.lastName === '') {
        res.status(400).json({
            message: "Last name is required."
        });

        return;
    } else if (formData.username === '') {
        res.status(400).json({
            message: "Username is required."
        });

        return;
    } else if (formData.password === '') {
        res.status(400).json({
            message: "Password is required."
        });

        return;
    }

    // No field is empty, continue

    // Check if username already exists within database
    const user = await users.findOne({
        username: formData.username
    });
    
    if (user != null) {
        res.status(409).json({
            message: "Username already exists."
        });

        return;
    }
    // Username is unique, continue

    // Create user
    const newUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password
    }

    // Insert user into database
    await users.insertOne(newUser);

    // Find user to verify creation
    const confirmUser = await users.findOne({
        username: formData.username
    });

    // Check if user was created
    if (confirmUser != null) {
        // User was created, send success message
        res.status(201).json({
            message: "User was successfully created."
        });

        return;
    } else {
        // User was not created, send error message
        res.status(400).json({
            message: "Failed to create user, please try again."
        });

        return;
    }
})