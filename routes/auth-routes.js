const router = require('express').Router();
const passport = require('passport');

// auth with google+
router.get('/google', passport.authenticate('google', { 
    scope: ['profile']
}));

// callback route for google to redirect to which gives us a code for passport to use
// exchanging code in url for profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //res.send(req.user);
    res.redirect('/profile');
});

module.exports = router;
