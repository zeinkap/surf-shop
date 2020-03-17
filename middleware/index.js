const Review = require('../models/review');

module.exports = {
    // this errorHandler will handle all possible errors dealing with async
    asyncErrorHandler: (fn) => 
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                    .catch(next);   // if unhandledPromiseException or error caught, it will hand it over to express
        },
        
    isReviewAuthor: async (req, res, next) => {
        let review = await Review.findById(req.params.review_id);
        if(review.author.equals(req.user._id)) {
            return next();
        }
        req.session.error = 'Bye bye';
        return res.redirect('/');
    },

    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.error = 'You need to be logged in to do that!';
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }

}