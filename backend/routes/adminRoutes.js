const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all pending seller applications
router.get('/admin/pending-sellers', async (req, res) => {
  try {
    const pendingSellers = await User.findAll({
      where: { role: 'seller', isApproved: false }
    });
    res.json(pendingSellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve or Decline a seller
router.post('/admin/verify-seller', async (req, res) => {
  const { userId, action } = req.body; // action: 'approve' or 'decline'
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === 'approve') {
      user.isApproved = true;
      await user.save();
      res.json({ message: "Seller approved successfully" });
    } else {
      // If declined, you might want to switch them back to 'buyer'
      user.role = 'buyer';
      await user.save();
      res.json({ message: "Application declined. User reverted to buyer." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;