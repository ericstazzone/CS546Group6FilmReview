const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const { ObjectId } = require('mongodb');
const validation = require('../validation');
const { endpoint, apiKey } = require('../config');

function currentDate() {
    const date = new Date();
    let month = (date.getMonth() + 1).toString();
    if (month.length === 1) month = `0${month}`;
    let day = (date.getDate()).toString();
    if (day.length === 1) day = `0${day}`;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

async function createReview(userId, movieId, title, content, rating) {
    movieId = validation.checkString(movieId, 'movie');
    title = validation.checkString(title, 'review title');
    content = validation.checkString(content, 'review body');
    if (!rating) throw 'Please provide a rating.';
    
    const reviewCollection = await reviews();
    const reviewId = ObjectId();
    let newReview = {
        _id: reviewId,
        title: title,
        content: content,
        rating: rating,
        createdDate: currentDate(),
        movieId: movieId,
        userId: userId,
        comments: []
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add review.';
    return {id: reviewId};
}

module.exports = {
    createReview
}