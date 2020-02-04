const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//password and username does not need to be added cuz that will come from passport
const PostSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [{ url: String, public_id: String }],   //url is coming from cloudinary and id is so we can edit/delete the images
    location: String,
    coordinates: Array,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Post', PostSchema);