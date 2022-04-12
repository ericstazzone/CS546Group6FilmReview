const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const {ObjectId} = require('mongodb');

module.exports = router;