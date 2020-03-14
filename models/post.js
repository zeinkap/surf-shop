const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

//password and username does not need to be added cuz that will come from passport
const PostSchema = new Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    images: [ { url: String, public_id: String } ],   //url is coming from cloudinary and id is so we can edit/delete the images
    location: {type: String, required: true},
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
// prehook middleware
PostSchema.pre('remove', async function() {
    await Review.remove({
        _id: {
            $in: this.reviews   // removing from post.reviews array 
        }
    });
});

module.exports = mongoose.model('Post', PostSchema);