const express = require('express');
const router = express.Router({ mergeParams: true });   //allows us to pull the ids
const { asyncErrorHandler, isReviewAuthor } = require('../middleware');
const {
    reviewCreate,
    reviewUpdate,
    reviewDestroy
} = require('../controllers/reviews');

/* Create */
router.post('/', asyncErrorHandler(reviewCreate));

/* Update */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* Destroy */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));
  
module.exports = router;


