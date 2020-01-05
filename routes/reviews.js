const express = require('express');
const router = express.Router({ mergeParams: true });   //allows us to pull the ids

/* GET reviews index /posts/:id/reviews */
router.get('/', (req, res, next) => {
    res.send('INDEX /reviews');
});

/* Create */
router.post('/', (req, res, next) => {
    res.send('CREATE /reviews');
});

/* Edit */
router.get('/:review_id/edit', (req, res, next) => {
    res.send('EDIT /reviews/:review_id/edit');
});

/* Update */
router.put('/:review_id', (req, res, next) => {
    res.send('UPDATE /reviews/:review_id');
});

/* Destroy */
router.delete('/:review_id', (req, res, next) => {
    res.send('DESTROY /reviews/:review_id');
});
  
module.exports = router;