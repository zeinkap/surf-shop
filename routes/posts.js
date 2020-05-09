const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary, storage } = require('../cloudinary');
const upload = multer({ storage });
const { asyncErrorHandler, isLoggedIn, isAuthor } = require('../middleware');
const { 
    postIndex,
    postNew, 
    postCreate, 
    postShow, 
    postEdit, 
    postUpdate, 
    postDestroy 
} = require('../controllers/posts');

/* GET posts index /posts */
router.get('/', asyncErrorHandler(postIndex));

/* New */
router.get('/new', isLoggedIn, postNew);

/* Create */
router.post('/', isLoggedIn, upload.array('images', 4), asyncErrorHandler(postCreate));

/* Show */
router.get('/:id', asyncErrorHandler(postShow));

/* Edit */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), postEdit);

/* Update */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array('images', 4), asyncErrorHandler(postUpdate));

/* Destroy */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy));

module.exports = router;