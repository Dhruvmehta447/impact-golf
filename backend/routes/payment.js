const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { plan } = req.body; // Expecting "monthly" or "yearly" from the frontend

    // Determine the price based on the plan
    let priceAmount = 0;
    let planName = '';

    if (plan === 'monthly') {
      priceAmount = 1000; // Stripe counts in pennies! 1000 = $10.00
      planName = 'Monthly Subscription';
    } else if (plan === 'yearly') {
      priceAmount = 10000; // 10000 = $100.00
      planName = 'Yearly Subscription';
    } else {
      return res.status(400).json({ message: 'Invalid subscription plan.' });
    }

    // Tell Stripe to create a checkout page
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // We are doing a one-time payment simulation for this project
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Golf Charity Platform - ${planName}`,
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      // Where should Stripe send the user after they pay (or if they cancel)?
      success_url: 'http://localhost:5173/dashboard?payment=success',
      cancel_url: 'http://localhost:5173/dashboard?payment=cancelled',
    });

    // Send the secure Stripe URL back to the frontend so it can redirect the user
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ message: 'Error creating checkout session.' });
  }
});

// The Verification Route
router.post('/verify', protect, async (req, res) => {
  try {
    // Find the logged-in user and upgrade their status!
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { isSubscribed: true }, 
      { new: true } // Return the updated user
    );

    res.status(200).json({ message: 'Database updated! User is now a premium subscriber.', user: updatedUser });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: 'Error verifying payment.' });
  }
});

module.exports = router;