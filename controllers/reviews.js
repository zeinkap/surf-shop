const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
    // Posts Create
    async reviewCreate(req, res, next) {
        // find the post by its id
        let post = await Post.findById(req.params.id).populate('reviews').exec();
        // check if user has submitted a past review
        let hasReviewed = post.reviews.filter(review => {
            return review.author.equals(req.user._id);
        }).length;
        if(hasReviewed) {
            req.session.error = 'Sorry, you can only submit one review per post';
            return res.redirect(`/posts/${post.id}`);
        }
        // create the review
        req.body.review.author = req.user._id;
        let review = await Review.create(req.body.review);
        //assign review to post
        post.reviews.push(review);
        //save the post
        post.save();
        // redirect to the post
        req.session.success = 'Review created successfully';
        res.redirect(`/posts/${post.id}`);
    },

    async reviewUpdate(req, res, next) {
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Your Review was updated.';
        res.redirect(`/posts/${req.params.id}`);
    },

    async reviewDestroy(req, res, next) {
        // remove review id from post review array
        await Post.findByIdAndUpdate(req.params.review_id, {
            $pull: { reviews: req.params.review_id }    // grabbing the property we want to update 
        });
        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success = 'Your Review was deleted.';
        res.redirect(`/posts/${req.params.id}`);
    }
}