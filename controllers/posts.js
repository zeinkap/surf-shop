require('dotenv').config();
const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'zeinkap',
    api_key: '296737394658949',
    api_secret: process.env.CLOUDINARY_SECRET
});

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports = {
    // Posts Index
    async postIndex(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts });
    },
    //Posts New
    postNew(req, res, next) {
        res.render('posts/new');
    },
    // Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for(const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        // let response = await geocodingClient
        // .forwardGeocode({
        //     query: req.body.post.location,
        //     limit: 1
        // })
        // .send();
        // req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        let post = await Post.create(req.body.post);
        //console.log(post.coordinates);
        res.redirect(`/posts/${post.id}`);
    },

    async postShow(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/show', { post });
    },

    async postEdit(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
    },

    async postUpdate(req, res, next) {
        // handle deletion of images

        // check how many images are currently in array

        // include flash message that total # of images uploaded cannot exceed 4

        // handle upload of any new images
        let post = await Post.findByIdAndUpdate(req.params.id, req.body.post, { new: true });
        res.redirect(`/posts/${post.id}`);
    },

    async postDestroy(req, res, next) {
        let post = await Post.findByIdAndRemove(req.params.id);
        res.redirect('/posts');
    }
}