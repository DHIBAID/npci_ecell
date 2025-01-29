// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reward = require('../models/Reward');
const { hmac } = require('../utils/encryption');
const { generateToken } = require('../utils/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, seller, admin]
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const emailHash = hmac(email);
    
    if (await User.findOne({ emailHash })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password, role });
    await user.save();

    if (role === 'customer') {
      await new Reward({ customerId: user._id }).save();
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ emailHash: hmac(email) }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ token: generateToken(user) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
