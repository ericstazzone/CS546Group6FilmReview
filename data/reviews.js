const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const movies = mongoCollections.movies;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const settings = require('../config/settings');
const apiKey = settings.apiKey;

// Returns an array of all review titles and thier correspomdimg movie title
// the elements of the array are objects in the form of {reviewTitle: reviewTitle, movieTitle: movieTitle}
async function getAllReviewTitlesAndMovieTitles(){
    const reviewCollection = await reviews();

    //get all reviews and use projection to only get _id, review title,  and review movieId
    //then use sort() method to sort the reivews from newest to oldest.
    //**utilize createdDate attribute of
    const allReviewsTitleAndMovieId = await reviewCollection.find({}, {projection: {_id:1,title:1,movieId:1,}}).sort({_id:-1}).toArray(); 
    if (!allReviewsTitleAndMovieId) { throw 'Error: Could not get all review titles and corresponding movie Ids';}

    let reviewTitleAndMovieTitlesList = [];
    for(let review of allReviewsTitleAndMovieId){
        const movie = await getMovieById(review.movieId.toString()); //call data function to get movie title from movieId gathered from review
        reviewTitleAndMovieTitlesList.push( {reviewTitle: review.title, movieTitle: movie.title} );
    }
    
    return reviewTitleAndMovieTitlesList;
}

// returns the movie title of the id provided
async function getMovieById(movieId){
    movieId = validation.checkId(movieId); //check movie id is valid

    const movieCollection = await movies();
    const movie = await movieCollection.findOne({ _id: ObjectId(movieId) }); //find movie with given id
    if (!movie) {throw 'Error: No movie with that id';} //check if movie exists
    movie._id = movie._id.toString(); //convert _id from ObjectId to String for proper output
    return movie;
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

//adds a review for seed task
//**add argument checking if going into production
async function addMovieSeed(title, director, genre, mainCast, releaseDate, averageRating, imgLink){
    const movieCollection = await movies();
    let newMovie = { 
        title:title,
        director:director,
        genre:genre,
        mainCast:mainCast,
        releaseDate:releaseDate,
        averageRating:averageRating,
        imgLink:imgLink
    }

    const insertInfo = await movieCollection.insertOne(newMovie); 
    if (!insertInfo.acknowledged || !insertInfo.insertedId){ throw 'Error: Could not add band';} 

    const newId = insertInfo.insertedId.toString();
    const movie = await movieCollection.findOne({ _id: ObjectId(newId)});
    if (!movie) throw 'Error: No band with that id'; 

    movie._id = movie._id.toString();
    return movie;
}

module.exports = {
    getAllReviewTitlesAndMovieTitles,
    getMovieById,
    addReviewSeed,
    addMovieSeed
};