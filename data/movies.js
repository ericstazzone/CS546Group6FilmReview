const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const settings = require('../config/settings');
const apiKey = settings.apiKey;

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
    getMovieById,
    addMovieSeed
};