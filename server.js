const express = require("express");
const bcrypt = require("bcryptjs"); // Use bcryptjs for better compatibility
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Simulated in-memory database for demo purposes
const users = [];

// Register User
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
    }

    try {
        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
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
    const user = users.find((u) => u.username === username);
    if (!user) {
        return res.status(400).json({ message: "Invalid username or password." });
    }

    try {
        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.status(200).json({ message: "Login successful!", rewards: 100 }); // Example reward
        } else {
            res.status(400).json({ message: "Invalid username or password." });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Start Server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
