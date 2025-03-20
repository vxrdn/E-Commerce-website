const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kickskart_secret_key';

// @route   POST /auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: {
        [Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ detail: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    res.status(201).json({ 
      message: 'User registered successfully'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ detail: 'Server error during registration' });
  }
});

// @route   POST /auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ detail: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ detail: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Server error during login' });
  }
});

module.exports = router;
