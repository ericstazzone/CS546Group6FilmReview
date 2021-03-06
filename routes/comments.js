const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const {ObjectId} = require('mongodb');
const xss = require('xss');
const validation = require('../validation');
const reviewData = data.reviews

module.exports = router;

router.post('/', async (req, res) => {

    var userId = req.session.user;
    var previousUrl = req.get('referer');
    var reviewId = previousUrl.slice(previousUrl.lastIndexOf("/")+1);
    var commentContent = req['body']['comment'];

    // console.log("previousUrl: "+previousUrl);
    // console.log("reviewId: "+reviewId) ;
    // console.log("userId: "+userId);
    // console.log("commentContent: "+commentContent);
   
    var isLoggedIn = false;
    if(req.session.user){
        isLoggedIn = true;
    }
    try{
        commentContent = validation.checkString(xss(commentContent));
        reviewId = validation.checkId(xss(reviewId));
        userId = validation.checkId(xss(userId));
    } catch(e){
        return res.status(400).json({error: "Comment must be a string and cannot be empty"});
    }
   
    try{
        var comment = await commentData.addComment(reviewId, userId, commentContent);
    } catch(e){
        return res.status(500).json({error: "Could not add comment to review"});
    }
    
    res.redirect("reviews/"+reviewId);

});