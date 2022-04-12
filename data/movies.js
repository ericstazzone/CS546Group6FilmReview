const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const settings = require('../config/settings');
const apiKey = settings.apiKey;