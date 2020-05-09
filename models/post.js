const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

//password and username does not need to be added cuz that will come from passport
const PostSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    images: [ { url: String, public_id: String } ],   //url is coming from cloudinary and id is so we can edit/delete images
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
    ],
    avgRating: { type: Number, default: 0 }
});

// adding instance method to PostSchema, so any doc in post can call this method
PostSchema.methods.calculateAvgRating = function() {
    let ratingsTotal = 0;
    if(this.reviews.length) {
        // loop thru each review and add up the ratings
        this.reviews.forEach(review => {
            ratingsTotal += review.rating;
        });
        this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;    // round to 2 decimal places
    } else {
        this.avgRating = ratingsTotal;
    }
    const floorRating = Math.floor(this.avgRating);     // round down to nearest integer
    this.save();
    return floorRating;
}

// prehook middleware
PostSchema.pre('remove', async function() {
    await Review.remove({
        _id: {
            $in: this.reviews   // removing from post.reviews array 
        }
    });
});

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);