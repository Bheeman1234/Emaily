const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
    app.post('/api/stripe', requireLogin, async (req, res) => {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 10,
            currency: 'usd',
            description: '$0.50 for 5 credits',
            payment_method_data: {
                type: "card",
                card: {
                    token: req.body.id,
                },
            },
            automatic_payment_methods: {
                enabled: 'true',
            },
        });

        req.user.credits += 0.10;
        const user = await req.user.save();

        res.send(user);
});
}