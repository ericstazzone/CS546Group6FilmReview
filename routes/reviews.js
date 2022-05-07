const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
const {ObjectId} = require('mongodb');
const validation = require('../validation');

module.exports = router;

router.get('/', async (req, res) => {
    return res.render('partials/reviews', {user: req.session.user});
});
router.post('/', async (req, res) => {
    let reviewList = []; //declare reviewList before attempting to populate it with data from database
    try{
        req.body.keyword = validation.checkKeyword(req.body.keyword);
        req.body.searchTerm = validation.checkSearchTerm(req.body.searchTerm);
        let searchTerm = (!req.body.searchTerm ? '' : req.body.searchTerm.toLowerCase());
        reviewList = await reviewData.getAllReviewDisplayInfo(req.body.keyword, searchTerm); //attempt to retrieve all review titles and thier corresponding movie titles from the database
    }catch(e){
        return res.status(500).json({error:e});
    }
    return res.status(200).json({success: true, reviewDisplayInfo: reviewList});
});

router.get('/home', async (req, res) => {
    let reviewList = []; //declare reviewList before attempting to populate it with data from database
    try{
        reviewList = await reviewData.getAllReviewDisplayInfo('Title',''); //no search term will display all reviews
        reviewList = reviewList.slice(0,5);
    }catch(e){
        return res.status(500).json({error:e});
    }
    return res.status(200).json({success: true, reviewDisplayInfo: reviewList});
});

router
    .route('/:id')
    .get(async (req, res) => {
        const id = req.params.id;
        if (id) {
            try {
                const review = await reviewData.getReviewById(id);
                if (review) {
                    review._id = review._id || 'N/A';
                    review.title = review.title || 'N/A';
                    review.createdDate = review.createdDate || 'N/A';
                    review.content = review.content || 'N/A';
                    review.rating = review.rating || 'N/A';
                    review.movieId = review.movieId || 'N/A';
                    review.userId = review.userId || 'N/A';
                    review.counter = review.counter.toString() || 'N/A';
                    // if there are no comments we don't really care
                }
                // use the function updateReviewCounter(reviewId) in the reviewData.js file to increment the counter for the review
                await reviewData.updateReviewCounter(id);

                var isLoggedIn = false
                if(req.session.user){
                    isLoggedIn = true
                }
                

                //render handlebars file in views/layouts/reviews.handlebars
                res.render('layouts/review', {
                    _id: review._id,
                    title: review.title,
                    createdDate: review.createdDate,
                    content: review.content,
                    rating: review.rating,
                    movieId: review.movieId,
                    userId: review.userId,
                    counter: review.counter,
                    comments: review.comments,
                    isLoggedIn : isLoggedIn
                });
            } catch (e) {
                res.status(500).json({error: e});
            }
        } else {
            res.status(400).json({error: 'Invalid id'});
        }
    });