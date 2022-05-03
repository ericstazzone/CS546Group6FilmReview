const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const { ObjectId } = require('mongodb');
const validation = require('../validation');
const moviesData = require('./movies');
const usersData = require('./users');
const settings = require('../config/settings');
const apiKey = settings.apiKey;

// Returns an array of all review titles and thier correspomdimg movie title
// the elements of the array are objects in the form of {reviewTitle: reviewTitle, movieTitle: movieTitle, reviewerName: reviewerName}
function userSearchFilter(movieRecord, keyword, searchTerm, reviewer){
    let check = false;
    searchTerm = searchTerm.toLowercase();
    if(keyword=="Title"){
        if(movieRecord.title == searchTerm){ check = true; }
    } else if(keyword=="Director"){
        if(movieRecord.director == searchTerm){ check = true; }
    } else if(keyword=="Actor"){
        if(movieRecord.mainCast.includes(searchTerm)){ check = true; }
    } else if (keyword=="Release Date"){ //** TODO: check that if the user provides a data as a search term is is a valid date 
        if(movieRecord.releaseDate == searchTerm){ check = true; }
    } else if (keyword=="Reviewer"){
        if(reviewer == searchTerm){ check = true; }
    }
    return check;
}

async function getAllReviewDisplayInfo(keyword,searchTerm){
    keyword = validation.checkKeyword(keyword);
    searchTerm = validation.checkSearchTerm(searchTerm);
    const reviewCollection = await reviews();

    //get all reviews and use projection to only get _id, review title, review movieId, reviewer userId
    //then use sort() method to sort the reivews from newest to oldest.
    //**utilize createdDate attribute of
    const allReviewsTitleAndMovieId = await reviewCollection.find({}, {projection: {_id:1,title:1,movieId:1,userId:1}}).sort({_id:-1}).toArray(); 
    if (!allReviewsTitleAndMovieId) { throw 'Error: Could not get all review titles and corresponding movie Ids';}

    let reviewTitleAndMovieTitlesList = [];
    if(searchTerm){ //if a search term is provided provide data normally
        for(let review of allReviewsTitleAndMovieId){
            const movie = await moviesData.getMovieById(review.movieId.toString()); //call data function to get movie title from movieId gathered from review
            const user = await usersData.getUser(review.userId.toString());
            if(userSearchFilter(movie, keyword, searchTerm, user.username)){
                reviewTitleAndMovieTitlesList.push( {reviewTitle: review.title, movieTitle: movie.title, reviewerName: user.username} );
            }        
        }
    } else { //if no search term is provided then display all data
        for(let review of allReviewsTitleAndMovieId){
            const movie = await moviesData.getMovieById(review.movieId.toString()); //call data function to get movie title from movieId gathered from review
            const user = await usersData.getUser(review.userId.toString());
            reviewTitleAndMovieTitlesList.push( {reviewTitle: review.title, movieTitle: movie.title, reviewerName: user.username} );      
        }
    }
    
    return reviewTitleAndMovieTitlesList;
}

//adds a review for seed task
//**add argument checking if going into production
async function addReviewSeed(title, createdDate, content, rating, movieId, userId, comments){
    const reviewCollection = await reviews();
    let newReview = { //construct new band object to be added to the bands collection
        title:title,
        createdDate:createdDate,
        content:content,
        rating:rating,
        movieId:movieId,
        userId:userId,
        comments:comments
    }

    const insertInfo = await reviewCollection.insertOne(newReview); //atempt to add newBand to the bands collection
    if (!insertInfo.acknowledged || !insertInfo.insertedId){ throw 'Error: Could not add band';} //check if the newBand was inserted
}

module.exports = {
    getAllReviewDisplayInfo,
    addReviewSeed,
};