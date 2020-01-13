const User = require('../models/user');
const passport = require('passport');

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
      failureRedirect: '/login', 
      failureFlash: true 
    })(req, res, next); //need to let passport know to invoke req and res
  },

  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  }

}