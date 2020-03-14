if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const Post = require('../models/post');
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'zeinkap',
    api_key: '296737394658949',
    api_secret: process.env.CLOUDINARY_SECRET
});
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAPBOX_TOKEN
});

module.exports = {
    // Posts Index
    async postIndex(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts, user: req.user, stripePublicKey, title: 'All Posts' });
    },
    //Posts New
    postNew(req, res, next) {
        res.render('posts/new', { title: 'New Posting', user: req.user });
    },
    // Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for (const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        let post = await Post.create(req.body.post);
        req.session.success = 'Post Created!';
        res.redirect(`/posts/${post.id}`);
    },
    // Posts Show
    async postShow(req, res, next) {
        let post = await Post.findById(req.params.id).populate({    //populating all reviews for post
            path: 'reviews',    
            options: { sort: { '_id': -1}},  // sorting in desc order, so most recent ones come first
            populate: { // populating author for each review
                path: 'author',
                model: 'User'
            }
        });
        res.render('posts/show', { post, user: req.user, stripePublicKey });

    },
    // Post Edit
    async postEdit(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', { post, title: 'Edit Post', user: req.user });
    },
    // Post Update
    async postUpdate(req, res, next) {
        // find post by id
        let post = await Post.findById(req.params.id);
        // check for any images for deletion
        if (req.body.deleteImages && req.body.deleteImages.length) { // recall that images is an array, and if length 0 then falsy
            // assign deleteImages form req.body to own var
            let deleteImages = req.body.deleteImages;
            // loop over deleteImages
            for (const public_id of deleteImages) {
                // delete images form cloudinary
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
        // check if any new images selected for upload 
        if (req.files) {
            // upload images
            for (const file of req.files) {
                let image = await cloudinary.v2.uploader.upload(file.path);
                // add images to post.images array
                post.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
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
        // save the updated post into the db
        post.save();
        req.session.success = 'Your Post has been Updated.';
        res.redirect(`/posts/${post.id}`);
    },
    // Post Delete
    async postDestroy(req, res, next) {
        let post = await Post.findById(req.params.id);
        for (const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Your Post has been Deleted.'
        res.redirect('/posts');
    }
}