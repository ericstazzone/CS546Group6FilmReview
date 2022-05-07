const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const reviews = data.reviews;
const movies = data.movies;
const users = data.users;
const comments = data.comments;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    //TO DO: seed should have 5 users, 10 reviews, 5 movies, 5 comments
    let user1, user2, user3, user4, user5 = undefined;
    let review1, review2, review3, review4, review5, review6, review7, review8, review9, review10 = undefined;
    let movie1, movie2, movie3, movie4, movie5 = undefined;
    let comment1, comment2, comment3, comment4, comment5 = undefined;

    console.log("Begin seeding");

    //creating users
    try {
        user1 = await users.createUser("John", "Doe", "jonnjonn", "applesauce1234", "jonnjonn@gmail.com");
    } catch(e) {
        console.log("Got an error! 1");
        console.log(e);
    }
    try {
        user2 = await users.createUser("Savnick", "Patel", "savsavsav", "applesauce9101", "spate160@stevens.edu");
    } catch(e) {
        console.log("Got an error! 2");
        console.log(e);
    }
    try {
        user3 = await users.createUser("Kenneth", "Skelton", "KennsworthS", "123456789", "kskelto1@stevens.edu");
    } catch(e) {
        console.log("Got an error! 3");
        console.log(e);
    }
    try {
        user3 = await users.createUser("Abcdefg", "hijklmnop", "Abcd1234", "123456789", "12345678@stevens.edu");
    } catch(e) {
        console.log("Got an error! 4");
        console.log(e);
    }
    console.log("Done seeding users");

    //seeding movies
    try {
        movie1 = await movies.getMovie("tt0325980");
    } catch (e) {
        console.log("Got an error! 5");
        console.log(e);
    }
    try {
        movie2 = await movies.getMovie("tt0317219");
    } catch (e) {
        console.log("Got an error! 6");
        console.log(e);
    }
    try {
        movie3 = await movies.getMovie("tt7321322");
    } catch (e) {
        console.log("Got an error! 7");
        console.log(e);
    }
    console.log("Done seeding movies");
    
    //seeding reviews
    try {
        let temp1 = await users.getUserByUsername("jonnjonn");
        review1 = await reviews.createReview(temp1._id, movie1.id, "AReview 1", "Good Job Steve 1", 5);
    } catch(e) {
        console.log("Got an error! 8");
        console.log(e);
    }
    try {
        let temp2 = await users.getUserByUsername("savsavsav");
        review2 = await reviews.createReview(temp2._id, movie2.id, "BReview 2", "Good Job Steve 2", 7);
    } catch(e) {
        console.log("Got an error! 9");
        console.log(e);
    }
    try {
        let temp3 = await users.getUserByUsername("savsavsav");
        review3 = await reviews.createReview(temp3._id, movie3.id, "CReview 4", "Good Job Steve 12412", 6);

        let userIdString = temp3._id.toString()
        let reviewIdString = review3.id.toString()

        comment1 = await comments.addComment(reviewIdString, userIdString, "This movie is good")
    } catch(e) {
        console.log("Got an error! 10");
        console.log(e);
    }
    console.log("Done seeding reviews and comments");

    await dbConnection.closeConnection();
    console.log('Done seeding database');
}

main();