const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Stripe stuff
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require('stripe')(stripeSecretKey);

router.post('/cart-charge', (req, res, next) => {
    let data = Post.find({});
    let postsJson = JSON.parse(data);   // converting JSON data to object
    console.log(postsJson);
    let total = 0;
    console.log('This is the quantity: ' + post.quantity);
    req.body.posts.forEach((post) => {
        console.log('This is the payload id: ' + post.id);
        let postJson = postsJson.find(function(i) {
            return i.id.equals(post.id);
        });
        total = total + postJson.price * post.quantity;
        console.log('This is total: ' + total);
    });

    stripe.charges.create({
        amount: total,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(function() {
        console.log('Charge Successful');
        res.json({ message: 'Successfully purchased items' });
      }).catch(function() {
        console.log('Charge Fail');
        res.status(500).end();
      })
});


router.post('/payment', (req, res, next) => {
    const paymentAmount = req.body.amount;
    const customerEmail = req.body.stripeEmail;
    const stripeToken = req.body.stripeToken;
    console.log('This is the req.body info: ' + req.body);  // data is coming from submitted form

    // check list of customers to see if customer email already exists
    stripe.customers.list({'email' : customerEmail}, (err, customer) => {
        if(customer.data.length > 0) {
            // charge customer using his id
            stripe.charges.create({
                amount: paymentAmount,
                description: 'product description',
                currency: 'usd',
                customer: customer.data[0].id
            }).then(details => {
                console.log('customer already exists, don\'t need to create new one');
                res.render("posts/payment-confirmation");
            }).catch(err => res.send(err));
        } else {
            //if customer does not exist then create customer
            stripe.customers.create({
                email: customerEmail,
                description: "Test customer",
                source: stripeToken
            })
            .then(customer => {
                // charge customer
                stripe.charges.create({
                    amount: paymentAmount,
                    description: 'poduct description',
                    currency: 'usd',
                    customer: customer.id
                }).then(details => {
                    res.render("posts/payment-confirmation");
                }).catch(err => res.send(err));
            }).catch(err => res.send(err));
        }
    })
});

module.exports = router;