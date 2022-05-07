const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const reviews = data.reviews;
const movies = data.movies;
const users = data.users;
const comments = data.comments;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    //TO DO: seed should have 5 users, 10 reviews, 5 movies
    let user1, user2, user3, user4 = undefined;
    let review1, review2, review3 = undefined;
    let movie1, movie2, movie3 = undefined;
    let comment1 = undefined;

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
    try {
        user3 = await users.createUser("Kenneth", "Skelton", "KennsworthS", "123456789", "kskelto1@stevens.edu");
    } catch(e) {
        console.log("Got an error! 3");
        console.log(e);
    }
    console.log("3");
    try {
        user3 = await users.createUser("Abcdefg", "hijklmnop", "Abcd1234", "123456789", "12345678@stevens.edu");
    } catch(e) {
        console.log("Got an error! 4");
        console.log(e);
    }
    console.log("4");

    //seeding movies
    try {
        movie1 = await movies.getMovie("tt0325980");
    } catch (e) {
        console.log("Got an error! 5");
        console.log(e);
    }
    console.log("5");
    try {
        movie2 = await movies.getMovie("tt0317219");
    } catch (e) {
        console.log("Got an error! 6");
        console.log(e);
    }
    console.log("6");
    try {
        movie3 = await movies.getMovie("tt7321322");
    } catch (e) {
        console.log("Got an error! 7");
        console.log(e);
    }
    console.log("7")
    
    //seeding reviews
    try {
        let temp1 = await users.getUserByUsername("jonnjonn");
        review1 = await reviews.createReview(temp1._id, movie1.id, "AReview 1", "Good Job Steve 1", 5);
    } catch(e) {
        console.log("Got an error! 8");
        console.log(e);
    }
    console.log("8");
    try {
        let temp2 = await users.getUserByUsername("savsavsav");
        review2 = await reviews.createReview(temp2._id, movie2.id, "BReview 2", "Good Job Steve 2", 7);
    } catch(e) {
        console.log("Got an error! 9");
        console.log(e);
    }
    console.log("9");
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
    console.log("10");



    
    await dbConnection.closeConnection();
    console.log('Done seeding database');
}

main();