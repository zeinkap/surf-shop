const express = require('express');
const router = express.Router();
const passport = require('passport');
const googleMapKey = process.env.GOOGLE_MAP_KEY;

const {
	asyncErrorHandler,
	isLoggedIn,
	isValidPassword,
	changePassword
} = require('../middleware');

const {
	getRegister,
	postRegister,
	getLogin,
	postLogin,
	getLogout,
	getProfile,
	updateProfile
} = require('../controllers');

/* GET Home Page. */
router.get('/', (req, res, next) => {
	res.render('index', {
		user: req.user,
		title: 'Food Coma - Home'
	});
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

/* google authenticate routes */
// auth with google+
router.get('/auth/google', passport.authenticate('google', { // uses the GoogleStrategy we set up 
	scope: ['profile'] // info we want to retrieve about user
}));
// callback route for google to redirect to which gives us a code for passport to use
// exchanging code in url for profile info
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
	res.redirect('/profile');
});

/* GET Profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* Update Profile */
router.put('/profile', isLoggedIn,
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);

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

router.get('/geolocation', (req, res, next) => {
	res.render('geolocation', {
		googleMapKey,
		title: 'Geolocation'
	});
});

module.exports = router;