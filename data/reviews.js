const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const movies = mongoCollections.movies;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const settings = require('../config/settings');
const apiKey = settings.apiKey;

// Returns an array of all review titles and thier correspomdimg movie title
// the elments of the array are objects in the form of {reviewTitle: reviewTitle, movieTitle: movieTitle}
async function getAllReviewTitlesAndMovieTitles(){
    const reviewCollection = await reviews();

    //get all reviews and use projection to only get _id, review title,  and review movieId
    //then use sort() method to sort the reivews from newest to oldest.
    const allReviewsTitleAndMovieId = await reviewCollection.find({}, {projection: {_id:1,title:1,movieId:1}}).sort({_id:-1}).toArray(); 
    if (!allReviewsTitleAndMovieId) { throw 'Error: Could not get all review titles and corresponding movie Ids';}

    let reviewTitleAndMovieTitlesList = []
    for(let review of allReviewsTitleAndMovieId){
        const movie = await getMovieById(review.movieId.toString()); //call data function to get movie title from movieId gathered from review
        reviewTitleAndMovieTitlesList = reviewTitleAndMovieTitlesList.push( {reviewTitle: review.title, movieTitle: movie.title} );
    }
    
    return reviewTitleAndMovieTitlesList;
}

// returns the movie title of the id provided
async function getMovieById(movieId){
    movieId = checkId(movieId); //check movie id is valid

    const movieCollection = await movies();
    const movie = await movieCollection.findOne({ _id: ObjectId(movieId) }); //find movie with given id
    if (!movie) {throw 'Error: No movie with that id';} //check if movie exists

    movie._id = movie._id.toString(); //convert _id from ObjectId to String for proper output
    return movie;
}

module.exports = {
    getAllReviewTitlesAndMovieTitles,
    getMovieById
};