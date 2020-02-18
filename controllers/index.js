require('dotenv').config();
const User = require('../models/user');
const passport = require('passport');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

module.exports = {
  async postRegister(req, res, next) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      image: req.body.image
    });

    await User.register(newUser, req.body.password);
    res.redirect('/');
  },

  postLogin(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next); //need to let passport know to invoke req and res
  },

  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  },

  makePayment(req, res, next) {
    let amount = 500; // in cents

    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
      }))
    .then(charge => res.render("stripe/charge-message"));
  }

}