const axios = require('axios');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const settings = require('../config/settings');
const apiKey = settings.apiKey;



async function getUser(id) {
    id = validation.checkId(id);

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw 'Error: No user with that id';

    user._id = user._id.toString();
    return user;
}

async function getUserByUsername(username) {
    username = validation.checkUsername(username);

    const userCollection = await users();
    const user = await userCollection.findOne({username: {$regex: new RegExp(username, 'i')}});

    return user;
}

async function getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw 'Error: Could not get all users';
    for (const [i, e] of userList.entries()) {
        userList[i]._id = userList[i]._id.toString();
    }
    return userList;
}

async function checkUser(username, password) {
    username = validation.checkUsername(username);
    password = validation.checkPassword(password);
    
    let user = await getUserByUsername(username);
    if (!user) throw 'Error: Either the username or password is invalid';

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) throw 'Error: Either the username or password is invalid';
    return {authenticated: true};
}

async function createUser(firstName, lastName, username, password, email) {
    firstName = validation.checkString(firstName, 'firstName');
    lastName = validation.checkString(lastName, 'lastName');
    username = await validation.checkUsername(username);
    password = validation.checkPassword(password);
    email = validation.checkString(email, 'email');
    // TODO: Verify that email is of the proper format and has not been registered

    if (await getUserByUsername(username)) throw 'Error: username is taken';

    const userCollection = await users();
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        reviews: [],
        moviesReviewed: []
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error: Could not add user';
    return {userInserted: true};
}

async function removeUser(id) {
    id = validation.checkId(id);

    const userCollection = await users();
    const user = await this.getUser(id);
    const username = user.username;
    const deletionInfo = await userCollection.deleteOne({ _id: ObjectId(id) });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete user with id of ${id}`;
    }
    return `${username} has been successfully deleted`;
}

async function updateUsername(id, username) {
    id = validation.checkId(id);
    username = await validation.checkUsername(username);

    if (await getUserByUsername(username)) throw 'Error: username is taken';

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {username: username}}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: Could not update username';

    const user = await this.getUser(id);
    user._id = user._id.toString();
    return user;
}

async function updatePassword(id, password) {
    id = validation.checkId(id);
    password = validation.checkPassword(password);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {password: password}}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: Could not update password';

    const user = await this.getUser(id);
    user._id = user._id.toString();
    return user;
}

function testFunction() {
    console.log("Test output!");
}

// TODO: Add function(s) to update a user's firstName, lastName, and email as deemed necessary

module.exports = {
    getUser,
    getAllUsers,
    checkUser,
    createUser,
    removeUser,
    updateUsername,
    updatePassword,
    testFunction
}