const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//password and username does not need to be added cuz that will come from passport
const ReviewSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', ReviewSchema);