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
    let review1, review2, review3, review4, review5, review6, review7 = undefined;
    let movie1, movie2, movie3, movie4, movie5 = undefined;
    let comment1, comment2, comment3, comment4, comment5 = undefined;

    console.log("Begin seeding");

    //creating users
    try {
        user1 = await users.createUser("John", "Doe", "jonnjonn", "applesauce1234", "jonnjonn@gmail.com");
    } catch(e) {
        console.log(e);
    }
    try {
        user2 = await users.createUser("Savnick", "Patel", "savsavsav", "applesauce9101", "spate160@stevens.edu");
    } catch(e) {
        console.log(e);
    }
    try {
        user3 = await users.createUser("Kenneth", "Skelton", "KennsworthS", "123456789", "kskelto1@stevens.edu");
    } catch(e) {
        console.log(e);
    }
    try {
        user4 = await users.createUser("Abcdefg", "hijklmnop", "Abcd1234", "123456789", "12345678@stevens.edu");
    } catch(e) {
        console.log(e);
    }
    try {
        user5 = await users.createUser("Eric", "Applesauce", "eapplesauce", "123456789", "applesauce@stevens.edu");
    } catch(e) {
        console.log(e);
    }
    console.log("Done seeding users");

    //seeding movies
    try {
        movie1 = await movies.getMovie("tt0325980");
    } catch (e) {
        console.log(e);
    }
    try {
        movie2 = await movies.getMovie("tt0317219");
    } catch (e) {
        console.log(e);
    }
    try {
        movie3 = await movies.getMovie("tt7321322");
    } catch (e) {
        console.log(e);
    }
    try {
        movie4 = await movies.getMovie("tt0411008");
    } catch (e) {
        console.log(e);
    }
    try {
        movie5 = await movies.getMovie("tt0636289");
    } catch (e) {
        console.log(e);
    }
    console.log("Done seeding movies");
    
    //seeding reviews
    try {
        let temp1 = await users.getUserByUsername("jonnjonn");
        let tempb = await users.getUserByUsername("eapplesauce");
        review1 = await reviews.createReview(temp1._id, movie1.id, "A Good Movie", "Good Job Steve", 5);

        let userIdString = temp1._id.toString();
        let reviewIdString = review1.id.toString();

        comment1 = await comments.addComment(reviewIdString, userIdString, "This movie is good");

        userIdString = tempb._id.toString();
        reviewIdString = review1.id.toString();

        comment2 = await comments.addComment(reviewIdString, userIdString, "This movie is bad");
    } catch(e) {
        console.log(e);
    }
    try {
        let temp2 = await users.getUserByUsername("savsavsav");
        review2 = await reviews.createReview(temp2._id, movie2.id, "Bad Can't Believe I Saw This", "Good Job Steve", 7);
    } catch(e) {
        console.log(e);
    }
    try {
        let temp3 = await users.getUserByUsername("KennsworthS");
        let tempb = await users.getUserByUsername("savsavsav");
        review3 = await reviews.createReview(temp3._id, movie3.id, "Crazy Spectacle!", "Good Job Steve", 2);

        let userIdString = tempb._id.toString();
        let reviewIdString = review3.id.toString();

        comment3 = await comments.addComment(reviewIdString, userIdString, "This movie is good");
    } catch(e) {
        console.log(e);
    }
    try {
        let temp4 = await users.getUserByUsername("Abcd1234");
        review4 = await reviews.createReview(temp4._id, movie4.id, "Down Right Evil", "Good Job Steve", 10);
    } catch(e) {
        console.log(e);
    }
    try {
        let temp5 = await users.getUserByUsername("eapplesauce");
        let tempb = await users.getUserByUsername("Abcd1234");
        review5 = await reviews.createReview(temp5._id, movie5.id, "Everyone Loved It", "Good Job Steve", 4);

        let userIdString = temp5._id.toString();
        let reviewIdString = review5.id.toString();

        comment4 = await comments.addComment(reviewIdString, userIdString, "This movie is good");

        userIdString = tempb._id.toString();
        reviewIdString = review5.id.toString();

        comment5 = await comments.addComment(reviewIdString, userIdString, "This movie is bad, liar");
    } catch(e) {
        console.log(e);
    }
    try {
        let temp6 = await users.getUserByUsername("eapplesauce");
        review6 = await reviews.createReview(temp6._id, movie3.id, "What A Show!", "Good Job Steve", 6);
    } catch(e) {
        console.log(e);
    }
    try {
        let temp7 = await users.getUserByUsername("savsavsav");
        review7 = await reviews.createReview(temp7._id, movie5.id, "Out of My Seat Crazy!", "Good Job Steve", 8);
    } catch(e) {
        console.log(e);
    }

    console.log("Done seeding reviews and comments");

    await dbConnection.closeConnection();
    console.log('Done seeding database');
}

main();