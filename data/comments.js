const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
// TODO: Do we need a collection for comments? Or should we configure comments.js in such a way that it draws from the reviews collection?
// const comments = mongoCollections.comments;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const settings = require('./settings');
const apiKey = settings.apiKey;