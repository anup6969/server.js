const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mock databases
let users = [
    { username: 'testuser', password: 'password123', rewards: 0 }
];
let withdrawalRequests = [];

// Admin credentials
const adminCredentials = { username: 'admin', password: 'admin123' };

// Admin login endpoint
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminCredentials.username && password === adminCredentials.password) {
        res.json({ message: 'Admin login successful', isAdmin: true });
    } else {
        res.status(401).json({ message: 'Invalid admin credentials' });
    }
});

// Fetch withdrawal requests
app.get('/withdrawal-requests', (req, res) => {
    res.json(withdrawalRequests);
});

// User registration endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const userExists = users.find(user => user.username === username);

    if (userExists) {
        res.status(400).json({ message: 'Username already exists' });
    } else {
        users.push({ username, password, rewards: 0 });
        res.json({ message: 'User registered successfully' });
    }
});

// Add rewards endpoint
app.post('/add-reward', (req, res) => {
    const { username, reward } = req.body;
    const user = users.find(user => user.username === username);

    if (user) {
        user.rewards += reward;
        res.json({ message: 'Reward added successfully', totalRewards: user.rewards });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// User withdrawal request
app.post('/withdraw', (req, res) => {
    const { username, upiId } = req.body;
    const user = users.find(user => user.username === username);

    if (user && user.rewards >= 500) {
        withdrawalRequests.push({
            username,
            upiId,
            amount: user.rewards,
            status: 'Pending'
        });
        user.rewards = 0;
        res.json({ message: 'Withdrawal request submitted successfully' });
    } else {
        res.status(400).json({ message: 'Insufficient rewards or user not found' });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
