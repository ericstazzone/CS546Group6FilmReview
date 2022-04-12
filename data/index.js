// EXAMPLE: const userApiData = require('./userApi');
// TODO: const _____ = require('_____');
const userData = require('./users');
const movieData = require('./movies');
const reviewData = require('./reviews');
const commentData = require('./comments');

module.exports = {
  // EXAMPLE: userApi: userApiData
  // TODO: _____: _____
  users: userData,
  movies: movieData,
  reviews: reviewData,
  comments: commentData
};