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
        reviewList = await reviewData.getAllReviewDisplayInfo(req.body.keyword, searchTerm); //attemot to retrieve all review titles and thier corresponding movie titles from the database
    }catch(e){
        return res.status(500).json({error:e});
    }
    return res.status(200).json({success: true, reviewDisplayInfo: reviewList});
});

router.get('/home', async (req, res) => {
    let reviewList = []; //declare reviewList before attempting to populate it with data from database
    try{
        reviewList = await reviewData.getAllReviews();
        console.log(reviewList);
        console.log("test");
    }catch(e){
        return res.status(500).json({error:e});
    }
    return res.status(200).json({success: true, reviewDisplayInfo: reviewList});
});