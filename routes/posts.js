const express = require('express');
const router = express.Router();

/* GET posts index /posts */
router.get('/', (req, res, next) => {
    res.send('INDEX /posts');
});

/* New */
router.get('/new', (req, res, next) => {
    res.send('NEW /posts/new');
});

/* Create */
router.post('/', (req, res, next) => {
    res.send('CREATE /posts');
});

/* Show */
router.get('/:id', (req, res, next) => {
    res.send('SHOW /posts/:id');
});

/* Edit */
router.get('/:id/edit', (req, res, next) => {
    res.send('EDIT /posts/:id/edit');
});

/* Update */
router.put('/:id', (req, res, next) => {
    res.send('UPDATE /posts/:id');
});

/* Destroy */
router.delete('/:id', (req, res, next) => {
    res.send('DESTROY /posts/:id');
});
  
module.exports = router;