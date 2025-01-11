const mongoose = require('mongoose');
const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://9064686123:9064686123a@cluster0.zggpo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((err) => {
    console.error("MongoDB connection error: ", err);
});

// Simulated in-memory database for demo purposes (Replace with MongoDB)
const usersSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", usersSchema);

// Register User
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
    }

    try {
        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: "Registration successful!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "Invalid username or password." });
    }

    try {
        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.status(200).json({ message: "Login successful!", rewards: 100 });
        } else {
            res.status(400).json({ message: "Invalid username or password." });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on https://server-js-o0xl.onrender.com:${PORT}`);
});
