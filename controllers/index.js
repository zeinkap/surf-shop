const User = require('../models/user');
const passport = require('passport');

module.exports = {
  // GET Rregister
  getRegister(req, res, next) {
    res.render('users/register', { title: 'Register', username: '', email: '' });
  },

  async postRegister(req, res, next) {
    try {
      const user = await User.register(new User(req.body), req.body.password);
      req.login(user, function(err) {
        if (err) return next(err);
        req.session.success = `Welcome, ${user.username}!`;
        res.redirect('/');
      });
    } catch(err) {
      const { username, email } = req.body;
      let error = err.message;
      if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {  // can check via locus
        error = 'A user with the given email is already registered';  // rewriting error for user friendly msg
      }
      res.render('users/register', { title: 'Register', username, email, error })
    }
  },

  getLogin(req, res, next) {
    res.render('users/login', { title: 'Login' });
  },

  async postLogin(req, res, next) {
    const { username, password } = req.body;
    const { user, error } = await User.authenticate()(username, password);
    if(!user && error) {
      return next(error);
    }
    req.login(user, function(err) {
      if (err) return next(err);
      req.session.success = `Welcome back, ${username}!`;
      const redirectUrl = req.session.redirectTo || '/';
      delete req.session.redirectTo;
      res.redirect(redirectUrl);
    });
  },

  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  }

}