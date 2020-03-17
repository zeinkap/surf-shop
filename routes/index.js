const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware');
const { 
  getRegister,
  postRegister, 
  getLogin,
  postLogin, 
  getLogout
} = require('../controllers'); // doing destructuring ES6

/* GET Home Page. */
router.get('/', (req, res, next) => {
  res.render('index', { user:req.user, title: 'Food Coma - Home' });
});

/* GET Register Page */
router.get('/register', getRegister);

/* POST Register Page */
router.post('/register', asyncErrorHandler(postRegister));

/* GET Login */
router.get('/login', getLogin);

/* POST Login Page */
router.post('/login', asyncErrorHandler(postLogin));

/* Logout */
router.get('/logout', getLogout);

// /* GET Profile */
// router.get('/profile', (req, res, next) => {
//   res.send('GET /profile');
// });

// /* PUT Profile */
// router.put('/profile/:user_id', (req, res, next) => {
//   res.send('PUT /profile/:user_id');
// });

/* GET Forgot */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
});

/* PUT Forgot-pw */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot');
});

/* GET Reset-pw */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
});

/* PUT Reset-pw */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
});

module.exports = router;
