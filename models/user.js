const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

//password and username does not need to be added cuz that will come from passport
const UserSchema = new Schema({
    username: String,
    email: { type: String, unique: true, required: true },
    googleId: String,
    image: String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);