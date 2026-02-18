const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

router.get('/', async (req, res) => {
  try {
    // 1. Total Revenue
    const revenueResult = await Lead.aggregate([
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // 2. Leads Count
    const totalLeads = await Lead.countDocuments();

    // 3. Leads by Status
    const statusDistribution = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 4. Won Deals
    const wonDeals = await Lead.countDocuments({ status: 'Won' });

    // 5. Win Rate
    const winRate = totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0;

    // 6. Revenue by Source (NEW - For the Marked Feature)
    const revenueBySource = await Lead.aggregate([
      { $group: { _id: '$source', value: { $sum: '$value' } } }
    ]);

    res.json({
      totalRevenue,
      totalLeads,
      wonDeals,
      winRate,
      statusDistribution,
      revenueBySource // Sending this to frontend
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;