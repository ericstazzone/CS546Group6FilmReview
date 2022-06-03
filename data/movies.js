const axios = require('axios');
const validation = require('../validation');
const { endpoint, apiKey } = require('../config');

async function getMovie(id) {
    id = validation.checkString(id, 'movie'); //movie ids are from IMDB api, so they are not Object Ids

    const {data} = await axios.get(`${endpoint}/Title/${apiKey}/${id}`);
    if (!data.id) throw 'Could not find movie.'
    return data;
}

async function searchMovie(term) {
    term = validation.checkString(term);

    const {data} = await axios.get(`${endpoint}/SearchMovie/${apiKey}/${term}`);
    return data;
}

module.exports = {
    getMovie,
    searchMovie,
}
