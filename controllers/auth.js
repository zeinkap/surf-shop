const passport = require('passport');

module.exports = {
    googleAuth(req, res, next) {
        passport.authenticate('google', { // uses the GoogleStrategy we set up
        scope: ['profile']  // info we want to retrieve about user
        });
    },

    googleCallback(req, res, next) {
        passport.authenticate('google', { 
            successRedirect: '/profile',
            failureRedirect: '/'
        });
    },

    logout(req, res, next) {
        req.logout();
        res.redirect('/');
    }
}