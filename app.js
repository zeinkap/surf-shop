require('dotenv').config();

const express                 = require('express');
const createError             = require('http-errors');
const path                    = require('path');
const logger                  = require('morgan');
const cookieParser            = require('cookie-parser');
const bodyParser              = require('body-parser');
const passport                = require('passport');
const passportLocalMongoose   = require('passport-local-mongoose');
const session                 = require('express-session');
const flash                   = require('connect-flash');
const mongoose                = require('mongoose');
const methodOverride          = require('method-override');

// MODELS
const User                    = require('./models/user');

// ROUTES
const indexRouter             = require('./routes/index');
const postsRouter             = require('./routes/posts');
const reviewsRouter           = require('./routes/reviews');

const app = express();

//connecting to DB
mongoose.connect('mongodb://localhost:27017/surf-shop-mapbox', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// Configure Sessions and Passport (*Order is very important here!)
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'lil mac',
  resave: false,
  saveUninitialized: true
}));
// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mount routes
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
