const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { protect } = require('../middleware/authMiddleware')

router.post('/create-payment-intent', protect, asyncHandler(async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const { amount } = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe uses cents
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
  })

  res.json({ clientSecret: paymentIntent.client_secret })
}))

module.exports = router