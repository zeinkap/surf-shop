const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const util = require('util');	// introduced in node v8.0 will be used to update user profile

module.exports = {
	getRegister(req, res, next) {
		res.render('users/register', {
			title: 'Register',
			username: '',
			email: ''
		});
	},

	async postRegister(req, res, next) {
		try {
			const user = await User.register(new User(req.body), req.body.password);
			// login() automatically logs in new user and creates login session. user gets assigned to req.user
			req.login(user, function (err) {
				if (err) return next(err);
				req.session.success = `Welcome, ${user.username}!`;
				res.redirect('/');
			});
		} catch (err) {
			const {
				username,
				email
			} = req.body;
			let error = err.message;
			if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
				// give a custom error message
				error = 'A user with the given email is already registered'; // rewriting error for user friendly msg
			}
			res.render('users/register', {
				title: 'Register',
				username,
				email,
				error
			})
		}
	},

	getLogin(req, res, next) {
		if (req.isAuthenticated()) return res.redirect('/');
		if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
		res.render('users/login', { title: 'Login' });
	},

	async postLogin(req, res, next) {
		const {
			username,
			password
		} = req.body;
		const {
			user,
			error
		} = await User.authenticate()(username, password);
		if (!user && error) {
			return next(error);
		}
		req.login(user, function (err) {
			if (err) return next(err);
			req.session.success = `Welcome back, ${username}!`;
			const redirectUrl = req.session.redirectTo || '/';
			delete req.session.redirectTo;
			res.redirect(redirectUrl);
		});
	},

	getLogout(req, res, next) {
		req.logout(); // remove req.user and clear the login session
		res.redirect('/');
	},

	async getProfile(req, res, next) {
		// show up to 10 posts on user profile
		const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
		res.render('users/profile', { posts });
	},

	async updateProfile(req, res, next) {
		const {
			username,
			email
		} = req.body;
		const {
			user
		} = res.locals;
		// check if user updated username/email 
		if (username) user.username = username;
		if (email) user.email = email;
		// save updated user details to DB
		await user.save();
		// log user back in with the updated info via promsify req.login 
		const login = util.promisify(req.login.bind(req));	// now a method that returns a promise
		// log the user back in with new info
		await login(user);
		// redirect to /profile and show success message
		req.session.success = 'Profile successfully updated';
		res.redirect('/profile');
	}

}