const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const {ObjectId} = require('mongodb');
const comments = require('../data/comments')

module.exports = router;

router.post('/', async (req, res) => {

    var userId = req.session.user
    var previousUrl = req.get('referer')

    var reviewId = previousUrl.slice(previousUrl.lastIndexOf("/")+1)
    var commentContent = req['body']['commentForm']

    var comment = await comments.addComment(reviewId, userId, commentContent)

    res.redirect('back')
});