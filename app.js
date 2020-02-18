require('dotenv').config();

const express                 = require('express'),
      engine                  = require('ejs-mate'),
      createError             = require('http-errors'),
      path                    = require('path'),
      favicon                 = require('serve-favicon'),
      logger                  = require('morgan'),
      cookieParser            = require('cookie-parser'),
      bodyParser              = require('body-parser'),
      passport                = require('passport'),
      passportLocalMongoose   = require('passport-local-mongoose'),
      session                 = require('express-session'),
      mongoose                = require('mongoose'),
      methodOverride          = require('method-override')

// MODELS
const User                    = require('./models/user');

// ROUTES
const index             = require('./routes/index');
const posts             = require('./routes/posts');
const reviews           = require('./routes/reviews');

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
// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// set public assets directory
app.use(express.static('public'));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

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

// set local variables middleware
app.use(function(req, res, next) {
  // set default page title
  res.locals.title = 'Food Shop';
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next function in middleware chain
  next();
});


// Mount routes
app.use('/', index);
app.use('/posts', posts);
app.use('/posts/:id/reviews', reviews);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  // console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
