const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const validation = require('../validation');
const { endpoint, apiKey } = require('../config');
const reviews = require('./reviews');
const users = require('./users');
const allReviews = mongoCollections.reviews;

function currentDate() {
    const date = new Date();
    let month = (date.getMonth() + 1).toString();
    if (month.length === 1) month = `0${month}`;
    let day = (date.getDate()).toString();
    if (day.length === 1) day = `0${day}`;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

async function addComment(reviewId, userId, commentContent){

    commentContent = validation.checkString(commentContent);
    reviewId = validation.checkId(reviewId);
    userId = validation.checkId(userId);
    
    var review = await reviews.getReviewById(reviewId);
    if(!review){throw 'Could not get review';}
    var user = await users.getUser(userId);
    if(!user){throw 'Could not get user';}
    
    let comment = {
        userId : userId,
        name : user.username,
        date : currentDate(),
        commentContent : commentContent
    }

    review.comments.push(comment);
    const reviewCollection = await allReviews();

    const updatedInfo = await reviewCollection.updateOne(
        { _id: ObjectId(reviewId) },
        { $set: review }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update comment successfully';
    }

    return comment;
}

module.exports = {
    addComment,
    currentDate
}