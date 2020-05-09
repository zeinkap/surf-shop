const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
    // will handle all possible errors dealing with async
    asyncErrorHandler: (fn) => 
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                    .catch(next);   // if unhandledPromiseException or error caught, it will hand it over to express
        },
    
    // check if user is author of the review
    isReviewAuthor: async (req, res, next) => {
        let review = await Review.findById(req.params.review_id);
        if (review.author.equals(req.user._id)) {
            return next();
        }
        req.session.error = 'Sorry, you are not the author of this review';
        return res.redirect('/');
    },

    // check if user is logged in
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) return next();    // using passport to autenticate
        req.session.error = 'You need to be logged in to do that';
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    },

    // check if user is author of post
    isAuthor: async (req, res, next) => {
        const post = await Post.findById(req.params.id);
        if (post.author.equals(req.user._id)) {
            res.locals.post = post; // passing post onto next middleware chain
            return next();
        }
        req.session.error = 'Access denied';
        res.redirect('back');
    },

    isValidPassword: async (req, res, next) => {
		// we have access to req.user at this point so can use it
		const { user } = await User.authenticate()(req.user.username, req.body.currentPassword)
		if (user) { 
			// add user to res.locals
			res.locals.user = user;
			// go to next middleware
			next();
		} else {
			// flash an error
			req.session.error = 'Incorrect Current Password';
			// short circuit the route middleware and redirect to /profile
			return res.redirect('/profile');
		}
    },
    
	changePassword: async (req, res, next) => {
		// destructure new password values from req.body object
		const { 
			newPassword,
			passwordConfirmation
		} = req.body;
		
		// check user has entered in password for both fields
		if (newPassword && !passwordConfirmation) {
			req.session.error = 'Missing password confirmation';
			return res.redirect('/profile');
		}
		// check new password and confirm password match
		else if (newPassword && passwordConfirmation) {
			const { user } = res.locals;
				if (newPassword === passwordConfirmation) {
					// set new password on user object
					await user.setPassword(newPassword);
					next();
				} else {
					req.session.error = 'New passwords must match';
					return res.redirect('/profile');
				}
		} else {
			next();
		}
	}


}