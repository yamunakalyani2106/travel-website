const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/register')
    .then(() => console.log('MongoDB Connected Successfully 🚀'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const Users = mongoose.model('User', userSchema);

// Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Serve Registration Page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Handle Registration
app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // 🛡️ Check if passwords match
    if (password !== confirmPassword) {
        return res.send('Password and Confirm Password do not match!');
    }

    try {
        const user = new Users({ username, email, password });
        await user.save();
        console.log(' New User Saved:', user);
        res.send(' Registration Successful!');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send(' Registration Failed!');
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
