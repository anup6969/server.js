const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
