const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware');
const { 
  postRegister, 
  postLogin, 
  getLogout
} = require('../controllers'); // doing destructuring ES6

/* GET Home Page. */
router.get('/', (req, res, next) => {
  res.render('index', { user:req.user, title: 'Food Coma - Home' });
});

/* GET Register Page */
router.get('/register', (req, res, next) => {
  res.render('users/register', { user: req.user, title: 'Register Page'});
});

/* POST Register Page */
router.post('/register', postRegister);

/* GET Login */
router.get('/login', (req, res, next) => {
  res.render('users/login', {user: req.user});
});

/* POST Login Page */
router.post('/login', postLogin);

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
