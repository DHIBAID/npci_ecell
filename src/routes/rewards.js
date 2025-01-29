
// routes/rewards.js
const express = require('express');
const router = express.Router();
const { auth } = require('../utils/auth');
const Reward = require('../models/Reward');

/**
 * @swagger
 * /api/rewards/validate:
 *   post:
 *     tags: [Rewards]
 *     summary: Validate reward points (Seller only)
 */
router.post('/validate', auth(['seller']), async (req, res, next) => {
  try {
    const { customerId, points } = req.body;
    const reward = await Reward.findOneAndUpdate(
      { customerId },
      { $inc: { balance: points } },
      { new: true, upsert: true }
    );

    res.json({
      status: 'success',
      message: 'Points validated',
      normalizedPoints: points,
      balance: reward.balance
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/rewards/redeem:
 *   post:
 *     tags: [Rewards]
 *     summary: Redeem reward points (Customer only)
 */
router.post('/redeem', auth(['customer']), async (req, res, next) => {
  try {
    const { pointsToRedeem } = req.body;
    const reward = await Reward.findOne({ customerId: req.user.id });

    if (!reward || reward.balance < pointsToRedeem) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    reward.balance -= pointsToRedeem;
    await reward.save();

    res.json({
      status: 'success',
      message: 'Points redeemed',
      remaining_balance: reward.balance
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/rewards/balance:
 *   get:
 *     tags: [Rewards]
 *     summary: Get reward balance (Customer only)
 */
router.get('/balance', auth(['customer']), async (req, res, next) => {
  try {
    const reward = await Reward.findOne({ customerId: req.user.id });
    res.json({ status: 'success', balance: reward?.balance || 0 });
  } catch (error) {
    next(error);
  }
});

module.exports = router;