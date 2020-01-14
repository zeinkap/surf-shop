const express = require('express');
const router = express.Router();
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
router.post('/', asyncErrorHandler(postCreate));

/* Show */
router.get('/:id', asyncErrorHandler(postShow));

/* Edit */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* Update */
router.put('/:id', asyncErrorHandler(postUpdate));

/* Destroy */
router.delete('/:id', asyncErrorHandler(postDestroy));
  
module.exports = router;