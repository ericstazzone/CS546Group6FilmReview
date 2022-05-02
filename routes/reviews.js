const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
const {ObjectId} = require('mongodb');

module.exports = router;

router.get('/', async (req, res) => {
    return res.render('partials/reviews', {user: req.session.user});
});
router.post('/', async (req, res) => {
    let reviewList = []; //declare reviewList before attempting to populate it with data from database
    try{
        reviewList = await reviewData.getAllReviewTitlesAndMovieTitles(); //attemot to retrieve all review titles and thier corresponding movie titles from the database
    }catch(e){
        return res.status(500).json({error:e});
    }
    reviewList.push({reviewTitle: "test", movieTitle: "123"}) //**DEBUG code
    return res.status(200).json({success: true, reviewAndMovieTitlesList: reviewList});
});