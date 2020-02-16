const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({'dest': 'uploads/'});
const { asyncErrorHandler } = require('../middleware');
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
router.get('/new', postNew);

/* Create */
router.post('/', upload.array('images', 4), asyncErrorHandler(postCreate));

/* Show */
router.get('/:id', asyncErrorHandler(postShow));

/* Edit */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* Update */
router.put('/:id', upload.array('images', 4), asyncErrorHandler(postUpdate));

/* Destroy */
router.delete('/:id', asyncErrorHandler(postDestroy));
  
module.exports = router;