const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mock users database
let users = [{ username: 'testuser', password: 'password123', rewards: 0 }];

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: 'Login successful', rewards: user.rewards });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Register endpoint
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
        res.json({ message: 'Reward added', totalRewards: user.rewards });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Withdraw endpoint
app.post('/withdraw', (req, res) => {
    const { username } = req.body;
    const user = users.find(user => user.username === username);
    if (user && user.rewards > 0) {
        const amount = user.rewards;
        user.rewards = 0;
        res.json({ message: `Withdrawal successful: ₹${amount}` });
    } else {
        res.status(400).json({ message: 'Insufficient rewards or user not found' });
    }
});

// Root endpoint for health check
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
