const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const {ObjectId} = require('mongodb');
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
        commentContent = validation.isString(commentContent);
        reviewId = validation.checkId(reviewId);
        userId = validation.checkId(userId);
    } catch(e){
        return res.status(400).json({error: "Comment must be a string and cannot be empty"});
    }
   
    var comment = await commentData.addComment(reviewId, userId, commentContent);
    
    res.redirect("reviews/"+reviewId)

});