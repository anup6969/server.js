const express = require("express");
const bcrypt = require("bcryptjs"); // Use bcryptjs for better compatibility
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simulated in-memory database for demo purposes
const users = [];

// Initialize with default admin credentials
(async () => {
    const adminPassword = await bcrypt.hash("admin123", 10);
    users.push({
        username: "admin",
        password: adminPassword,
        role: "admin",
    });
})();

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
        users.push({ username, password: hashedPassword, role: "user" }); // Default role is "user"
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
            res.status(200).json({
                message: "Login successful!",
                rewards: 100, // Example reward
                role: user.role, // Return user role
            });
        } else {
            res.status(400).json({ message: "Invalid username or password." });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Admin Login
app.post("/admin-login", async (req, res) => {
    const { username, password } = req.body;

    // Check if admin user exists
    const user = users.find((u) => u.username === username && u.role === "admin");
    if (!user) {
        return res.status(400).json({ message: "Invalid admin credentials." });
    }

    try {
        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.status(200).json({ message: "Admin login successful!" });
        } else {
            res.status(400).json({ message: "Invalid admin credentials." });
        }
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Fetch Withdrawal Requests (Simulated)
app.get("/withdrawal-requests", (req, res) => {
    // Simulated data for withdrawal requests
    const withdrawalRequests = [
        { username: "user1", id: "1234567890", token: 50, status: "Pending" },
        { username: "user2", id: "0987654321", token: 100, status: "Completed" },
    ];

    res.status(200).json(withdrawalRequests);
});

// Summary Request (Handle user withdrawal requests)
app.post("/summary-request", (req, res) => {
    const { username, id, token } = req.body;

    if (!username || !id || !token) {
        return res.status(400).json({ message: "Username, ID, and token amount are required." });
    }

    console.log(`Withdrawal request received: ${username}, ID: ${id}, Token: ${token}`);
    res.status(200).json({ message: "Request submitted successfully!" });
});

// Start Server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
