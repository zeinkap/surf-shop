require('dotenv').config();
const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware');
const keyPublishable = process.env.STRIPE_API;
const { 
  postRegister, 
  postLogin, 
  getLogout, 
  makePayment 
} = require('../controllers'); // doing destructuring ES6

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Food Coma - Home'});
});

/* GET /register */
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});

/* POST /register */
router.post('/register', asyncErrorHandler(postRegister));

/* GET /login */
router.get('/login', (req, res, next) => {
  res.send('GET /login', {user: req.user, message: req.flash('error')});
});

/* POST /login */
router.post('/login', postLogin);

/* GET /logout */
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile', (req, res, next) => {
  res.send('GET /profile');
});

/* PUT /profile */
router.put('/profile/:user_id', (req, res, next) => {
  res.send('PUT /profile/:user_id');
});

/* GET /forgot */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
});

/* PUT /forgot-pw */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot');
});

/* GET /reset-pw */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
});

/* PUT /reset-pw */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
});

/* Get Stripe form*/
router.get('/payment', (req, res, next) => {
  res.render('stripe/index', { keyPublishable, title: 'Payment' });
});

/* POST Stripe */
router.post('/payment', makePayment)

module.exports = router;
