const express = require('express');
const router = express.Router({ mergeParams: true });   //allows us to pull the ids

/* Create */
router.post('/', (req, res, next) => {
    res.send('CREATE /reviews');
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