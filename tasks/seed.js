const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const reviews = data.reviews;
const movies = data.movies;
const users = data.users;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    //TO DO: seed should have 5 users, 10 reviews, 5 movies
    let user1, user2 = undefined;
    let review1, review2, review3 = undefined;
    let movie1, movie2, movie3 = undefined;

    //creating users
    try {
        user1 = await users.createUser("John", "Doe", "jonnjonn", "applesauce1234", "jonnjonn@gmail.com");
    } catch(e) {
        console.log("Got an error! 1");
        console.log(e);
    }
    console.log("1");
    try {
        user2 = await users.createUser("Savnick", "Patel", "savsavsav", "applesauce9101", "spate160@stevens.edu");
    } catch(e) {
        console.log("Got an error! 2");
        console.log(e);
    }
    console.log("2");
    //seeding movies
    try {
        movie1 = await movies.addMovieSeed("AMovie Title 1", "Director 1", ["Genre 1", "Genre 2"], ["Actor 1","Actress 1"], "1/1/2001", 1, "temp img link 1");
    } catch(e) {
        console.log("Got an error! 3");
        console.log(e);
    }
    console.log("3");
    try {
        movie2 = await movies.addMovieSeed("BMovie Title 2", "Director 2", ["Genre 3", "Genre 4"], ["Actor 3","Actress 4"], "2/2/2002", 2, "temp img link 2");
    } catch(e) {
        console.log("Got an error! 4");
        console.log(e);
    }
    console.log("4");
    try {
        movie3 = await movies.addMovieSeed("CMovie Title 3", "Director 3", ["Genre 5", "Genre 6"], ["Actor 5","Actress 6"], "3/3/2003", 3, "temp img link 3");
    } catch(e) {
        console.log("Got an error! 5");
        console.log(e);
    }
    console.log("5");
    //seeding reviews
    try {
        let temp1 = await users.getUserByUsername("jonnjonn");
        await reviews.addReviewSeed("Review 1", "05/02/2022", "Good Job Steve 1", 5, movie1._id, temp1._id, []);
    } catch(e) {
        console.log("Got an error! 6");
        console.log(e);
    }
    console.log("6");
    try {
        let temp2 = await users.getUserByUsername("savsavsav");
        await reviews.addReviewSeed("Review 2", "05/02/2022", "Good Job Steve 2", 4.5, movie2._id, temp2._id, []);
    } catch(e) {
        console.log("Got an error! 7");
        console.log(e);
    }
    console.log("7");
    try {
        let temp2 = await users.getUserByUsername("savsavsav");
        review1 = await reviews.addReviewSeed("Review 3", "05/02/2022", "Good Job Steve 3", 4, movie3._id, temp2._id, []);
    } catch(e) {
        console.log("Got an error! 8");
        console.log(e);
    }
    console.log("8");
    
    await dbConnection.closeConnection();
    console.log('Done seeding database');
}

main();