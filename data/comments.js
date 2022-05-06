const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
// TODO: Do we need a collection for comments? Or should we configure comments.js in such a way that it draws from the reviews collection?
// const comments = mongoCollections.comments;
const { ObjectId } = require('mongodb');
const validation = require('../validation');
const { endpoint, apiKey } = require('../config');
const reviews = require('reviews')
const users = require('users')


function currentDate() {
    const date = new Date();
    let month = (date.getMonth() + 1).toString();
    if (month.length === 1) month = `0${month}`;
    let day = (date.getDate()).toString();
    if (day.length === 1) day = `0${day}`;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}


async function addComment(reviewId, userId, comment){

    review = reviews.get

    
}