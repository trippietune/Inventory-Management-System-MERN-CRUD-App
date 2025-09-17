const express = require('express');
const router = express.Router();
const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret Key for JWT (ควรเก็บใน .env file)
const JWT_SECRET = 'your_super_secret_key'; 

// Route for new user registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error occurred.", error: error.message });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Logged in successfully.", token, role: user.role });

  } catch (error) {
    res.status(500).json({ message: "Server error occurred.", error: error.message });
  }
});

module.exports = router;