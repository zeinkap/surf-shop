require('dotenv').config();

const crypto = require('crypto'); // to get unique string for image id
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'zeinkap',
	api_key: '296737394658949',
	api_secret: process.env.CLOUDINARY_SECRET
});
const cloudinaryStorage = require('multer-storage-cloudinary');
const storage = cloudinaryStorage({
	cloudinary,
	folder: 'surf-shop',
	allowedFormats: ['jpeg', 'jpg', 'png'],
	filename: function (req, file, cb) {
		let buf = crypto.randomBytes(16);
		buf = buf.toString('hex');
		let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
		uniqFileName += buf; // now we have original filename, w/o the file extension, with a random 32 char string
		cb(undefined, uniqFileName); // callback names the file when uploads and stores it to cloudinary
	}
});

module.exports = {
	cloudinary,
	storage
}