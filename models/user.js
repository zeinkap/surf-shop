const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

//password and username does not need to be added cuz that will come from passport
const UserSchema = new Schema({
    email: String,
    image: String,
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);