const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAPBOX_TOKEN
});

module.exports = {
    // Posts Index
    async postIndex(req, res, next) {
        let posts = await Post.paginate({}, {
            page: req.query.page || 1,
 		    limit: 10
        });
        posts.page = Number(posts.page);
        res.render('posts/index', { posts, stripePublicKey, title: 'All Posts' });
    },

    //Posts New
    postNew(req, res, next) {
        res.render('posts/new', { title: 'New Post' });
    },

    // Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for(const file of req.files) {
            req.body.post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        req.body.post.author = req.user._id;
        let post = await Post.create(req.body.post);
        await post.save();
        req.session.success = 'Post created';
        res.redirect(`/posts/${post.id}`);
    },

    // Posts Show
    async postShow(req, res, next) {
        // find post and populate all its reviews
        let post = await Post.findById(req.params.id).populate({    
            path: 'reviews',    
            options: { sort: { '_id': -1}},  // sort in desc order, so most recent review come first
            populate: { // populate author for each review
                path: 'author',
                model: 'User'
            }
        });
        const floorRating = post.calculateAvgRating();  // function is defined in post schema
        res.render('posts/show', { post, floorRating, stripePublicKey });
    },
    
    // Post Edit
    postEdit(req, res, next) {
        res.render('posts/edit', { title: 'Edit Post' }); // post already being sent from isAuthor middleware
    },

    // Post Update
    async postUpdate(req, res, next) {
        // destructure post
        const { post } = res.locals;
        // check for any images for deletion
        // recall images is an array, and if length 0 then falsy
        if (req.body.deleteImages && req.body.deleteImages.length) { 
            // assign deleteImages from req.body to own var
            let deleteImages = req.body.deleteImages;
            // loop over deleteImages
            for (const public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                // delete image from post.images
                for (const image of post.images) {
                    if (image.public_id === public_id) {
                        let index = post.images.indexOf(image);
                        post.images.splice(index, 1); // removing 1 element from array
                    }
                }
            }
        }
        // check if any new images uploaded 
        if (req.files) {
            // upload new images
            for (const file of req.files) {
                post.images.push({
                    url: file.secure_url,
                    public_id: file.public_id
                });
            }
        }
        // check if location was updated
        if (req.body.post.location !== post.location) {
            let response = await geocodingClient
                .forwardGeocode({
                    query: req.body.post.location,
                    limit: 1
                })
                .send();
            post.coordinates = response.body.features[0].geometry.coordinates;
            post.location = req.body.post.location;
        }
        // update the post with any new properties
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        await post.save();
        req.session.success = `${post.title} post has been updated.`;
        res.redirect(`/posts/${post.id}`);
    },

    // Post Delete
    async postDestroy(req, res, next) {
        const { post } = res.locals;
        for (const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = `${post.title} post has been deleted.`
        res.redirect('/posts');
    }
}