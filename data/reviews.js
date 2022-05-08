const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const validation = require('../validation');
const moviesData = require('./movies');
const usersData = require('./users');
const { endpoint, apiKey } = require('../config');

// Returns an array of all review titles and thier corresponding movie title
// the elements of the array are objects in the form of {reviewTitle: reviewTitle, movieTitle: movieTitle, reviewerName: reviewerName}
function userSearchFilter(movieRecord, keyword, searchTerm, reviewer){
    movieRecord = validation.validateMovieData(movieRecord);
    let check = false;
    searchTerm = searchTerm.toLowerCase();
    if(keyword=="Title"){
        if(movieRecord.title.toLowerCase() == searchTerm){ check = true; }
    } else if(keyword=="Director"){
        let dList = movieRecord.directorList.map(elem => elem.name.toLowerCase())
        if(dList.includes(searchTerm)){ check = true; }
    } else if(keyword=="Actor"){
        let aList = movieRecord.starList.map(elem => elem.name.toLowerCase())
        if(aList.includes(searchTerm)){ check = true; }
    } else if (keyword=="Release Date"){
        if(movieRecord.releaseDate == searchTerm){ check = true; }
    } else if (keyword=="Reviewer"){
        if(reviewer.toLowerCase() == searchTerm){ check = true; }
    }
    return check;
}

async function getAllReviewDisplayInfo(keyword,searchTerm){
    keyword = validation.checkKeyword(keyword);
    searchTerm = validation.checkSearchTerm(searchTerm,keyword);
    const reviewCollection = await reviews();

    //get all reviews and use projection to only get _id, review title, review movieId, reviewer userId
    //then use sort() method to sort the reivews from newest to oldest.
    const allReviewsTitleAndMovieId = await reviewCollection.find({}, {projection: {_id:1,title:1,movieId:1,movieTitle:1,userId:1,counter:1}}).sort({_id:-1}).toArray(); 
    if (!allReviewsTitleAndMovieId) { throw 'Error: Could not get all review titles and corresponding movie Ids';}

    let reviewTitleAndMovieTitlesList = [];
    if(searchTerm){ //if a search term is provided provide data normally
        for(let review of allReviewsTitleAndMovieId){
            let movie = await moviesData.getMovie(review.movieId.toString()); //call data function to get movie title from movieId gathered from review
            const user = await usersData.getUser(review.userId.toString());
            if(userSearchFilter(movie, keyword, searchTerm, user.username)){
                reviewTitleAndMovieTitlesList.push( {reviewTitle: review.title, movieTitle: movie.title, reviewerName: user.username, reviewId: review._id, counter:review.counter} );
            }        
        }
    } else { //if no search term is provided then display all data
        for(let review of allReviewsTitleAndMovieId){
            const user = await usersData.getUser(review.userId.toString());
            reviewTitleAndMovieTitlesList.push( {reviewTitle: review.title, movieTitle: review.movieTitle, reviewerName: user.username, reviewId: review._id, counter:review.counter} );      
        }
    }
    
    return reviewTitleAndMovieTitlesList;
}

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
    userId = validation.checkId(userId);
    movieId = validation.checkString(movieId, 'movie');
    title = validation.checkString(title, 'review title');
    content = validation.checkString(content, 'review body');
    rating = validation.checkRating(rating);

    const movie = await moviesData.getMovie(movieId.toString());
    const reviewCollection = await reviews();
    const reviewId = ObjectId();
    let newReview = {
        _id: reviewId,
        title: title,
        content: content,
        rating: rating,
        createdDate: currentDate(),
        movieId: movieId,
        movieTitle: movie.title,
        userId: userId,
        counter: 0,
        comments: []
    };

    let insertInfo = await reviewCollection.insertOne(newReview);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add review.';

    const userCollection = await users();
    return userCollection
        .updateOne({_id: ObjectId(userId)}, {$addToSet: {reviews: reviewId, moviesReviewed: movieId}})
        .then(async function () {
            return {id: reviewId};
        });
}

async function getReviewById(reviewId) {
    reviewId = validation.checkId(reviewId);
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({_id: ObjectId(reviewId)});
    if (!review) {
        throw 'Review not found.';
    }
    return review;
}

async function updateReviewCounter(reviewId) {
    reviewId = validation.checkId(reviewId);
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({_id: ObjectId(reviewId)});
    if (!review) {
        throw 'Review not found.';
    }
    const updatedReview = await reviewCollection.updateOne({_id: ObjectId(reviewId)}, {$inc: {counter: 1}});
    if (!updatedReview.modifiedCount) {
        throw 'Could not increment counter.';
    }
    return true;
}

module.exports = {
    getAllReviewDisplayInfo,
    createReview,
    getReviewById,
    updateReviewCounter
}
