const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/userAuth'); // No need for useNewUrlParser or useUnifiedTopology
const db = mongoose.connection;
db.once('open', () => {
    console.log('MongoDB Connected Successfully 🚀');
});

// Schema for user registration
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema); // Collection: users

// Routes

// 🔐 Login Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 📝 Registration Page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// 🔒 Handle Login
// 🔒 Handle Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({ username, password });

  if (user) {
      // If the credentials are correct, redirect to add.html
      res.redirect('/add.html');
  } else {
      // If credentials are incorrect, send an error message
      res.send('Invalid credentials. Please try again.');
  }
});


// ✅ Handle Registration
app.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
      return res.send('Password and Confirm Password do not match!');
  }

  try {
      // Create and save a new user to the database
      const user = new User({ username, email, password });
      await user.save();
      console.log('New User Registered:', user);
      
      // Redirect to the login page after successful registration
      res.redirect('/');
  } catch (err) {
      console.error('Registration Error:', err);
      res.status(500).send('Registration Failed!');
  }
});


// 🧪 Debug: View all users (to check data in MongoDB)
app.get('/all-users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
