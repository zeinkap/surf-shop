const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { asyncErrorHandler } = require('../middleware');
// Stripe stuff
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require('stripe')(stripeSecretKey);

// charging payment from ind
router.post('/cart-charge', (req, res, next) => {
    let posts = Post.find({});
    const postsJson = JSON.parse(posts);
    const postsArray = postsJson;

    const paymentAmount = req.body.amount;
    const customerEmail = req.body.stripeEmail;
    const stripeToken = req.body.stripeToken;
    console.log('This is the req.body info: ' + req.body);  // data is coming from submitted form
    
    let total = 0;
    // need to access the posts in shopping cart
    req.body.posts.forEach((post) => {
        const postJson = postsArray.find(i => {
            return i.id == post.id
        })
        total = total + postJson.price * post.quantity;
    });
    console.log('This is the new total of cart: ' + total);

    // check list of customers to see if customer email already exists
    stripe.customers.list({'email' : customerEmail}, (err, customer) => {
        if(customer.data.length > 0) {
            //console.log(customer.data);
            // charge customer using his id
            stripe.charges.create({
                amount: total,
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
                    amount: total,
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


router.post('/charge', (req, res, next) => {
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