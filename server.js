const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const users = []; // Simulate database for demo purposes

// Register User
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    if (users.find((user) => user.username === username)) {
        return res.status(400).json({ message: "Username already exists." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        users.push({ username, password: hashedPassword }); // Save user
        res.status(200).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user." });
    }
});

// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(400).json({ message: "Invalid username or password." });
    }

    try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.status(200).json({ message: "Login successful!", rewards: 100 });
        } else {
            res.status(400).json({ message: "Invalid username or password." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in user." });
    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on https://server-js-o0xl.onrender.com");
});
