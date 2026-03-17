const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

router.post('/create-order', async (req, res) => {
    const { amount, userId } = req.body;

    if (amount < 210) {
        return res.status(400).json({ message: "Minimum deposit is ₹210" });
    }

    const orderId = `ORDER_${Date.now()}`;
    
    try {
        const response = await axios.post('https://api.cashfree.com/pg/orders', {
            order_id: orderId,
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: userId.toString(),
                customer_email: "user@example.com",
                customer_phone: "9999999999"
            }
        }, {
            headers: {
                'x-client-id': process.env.CASHFREE_APP_ID,
                'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                'x-api-version': '2022-09-01'
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response.data });
    }
});

// Webhook for Payment Verification
router.post('/webhook', async (req, res) => {
    // Note: In production, verify the Cashfree signature here using crypto
    const { order_id, order_amount, tx_status } = req.body.data.order;

    if (tx_status === 'SUCCESS') {
        // Update user balance in MySQL
        // await db.execute('UPDATE users SET balance = balance + ? WHERE id = ...', [order_amount]);
        console.log(`Payment Success: ${order_id}`);
    }
    res.send('OK');
});

module.exports = router;
