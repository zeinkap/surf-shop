require('dotenv').config();

const express = require('express'),
	engine = require('ejs-mate'),
	createError = require('http-errors'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	passport = require('passport'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override')

// MODELS
const User = require('./models/user');

// CONFIG
const passportSetup = require('./passport-google-setup');
const seedPosts = require('./seeds');
//seedPosts();

// ROUTES
const index = require('./routes/index');
const posts = require('./routes/posts');
const reviews = require('./routes/reviews');
const payment = require('./routes/payment');
// const authRoutes        = require('./routes/auth-routes');

const app = express();

//connecting to DB
mongoose.connect('mongodb://localhost:27017/surf_shop', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => console.log('DB Connected!'))
	.catch(err => {
		console.log(`DB Connection Error: ${err.message}`);
	});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// set public assets directory
app.use(express.static('public'));	// to serve static files from public directory
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));	// to use PUT method for submitting forms

// Configure Sessions and Passport (*Order is very important here!)
app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: process.env.SESSION_SECRET, // used to compute the hash to encrypt cookie
	resave: false,	// don't save session if unmodified
	saveUninitialized: true
}));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); // read data and encode it
passport.deserializeUser(User.deserializeUser()); // read data and un-encode it

// set local variables middleware
app.use(function (req, res, next) {
	// set default page title
	res.locals.title = 'Checkout Post';
	res.locals.currentUser = req.user;
	// set success message
	res.locals.success = req.session.success || '';
	delete req.session.success;
	// set error message
	res.locals.error = req.session.error || '';
	delete req.session.error;
	// continue to next function in middleware chain
	next();
});

// Mount routes
app.use('/', index);
app.use('/posts', posts);
app.use('/posts/:id/reviews', reviews);
app.use('/', payment);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	req.session.error = err.message;
	res.redirect('back');
});

module.exports = app;