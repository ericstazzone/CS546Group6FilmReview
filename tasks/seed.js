const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const users = data.users;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    let user1, user2, user3 = undefined;

    console.log("Seeding users...");

    try {
        user1 = await users.createUser("Patrick", "Juliano", "pjuliano", "patpat123", "pjuliano15@gmail.com");
    } catch(e) {
        console.log(e);
    }
    try {
        user2 = await users.createUser("First", "Last", "MyUsername", "MyPassword", "myemail@yahoo.com");
    } catch(e) {
        console.log(e);
    }
    try {
        user3 = await users.createUser("Guy", "Spelunky", "spelunker08", "i_hate_snakes", "theguy@outlook.com");
    } catch(e) {
        console.log(e);
    }

    console.log("Finished seeding!");

    await dbConnection.closeConnection();
}

main();