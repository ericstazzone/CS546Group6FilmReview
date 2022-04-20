const axios = require('axios');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const settings = require('../config/settings');
const apiKey = settings.apiKey;

const usernameRequirements = /^[a-zA-Z0-9]+$/g;
// TODO: If having the ! here doesn't work, remove the ! from in front of the test in checkPassword instead
const passwordRequirements = !/\s/g;

// Throws an error if the provided username is taken or it does not meet every requirement
async function checkUsername(username) {
    username = validation.checkString(username, 'username');

    // Check if username is of sufficient length
    if (username.length < 8) throw 'Error: username must be at least 8 characters long';
    // Check if username contains any illegal characters
    if (!usernameRequirements.test(username)) throw 'Error: username contains illegal characters';

    // Check if username is taken
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (user !== null) throw 'Error: username is taken';

    return username;
}

// Throws an error if the provided password does not meet every requirement
function checkPassword(password) {
    password = validation.checkString(password, 'password');
    
    // Check if password is of sufficient length
    if (password.length < 8) throw 'Error: password must be at least 8 characters long';
    // Check if password contains any illegal characters
    if (!passwordRequirements.test(password)) throw 'Error: password contains illegal characters';

    return password;
}

async function getUser(id) {
    id = validation.checkId(id);

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (user === null) throw 'Error: No user with that id';

    user._id = user._id.toString();
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

async function createUser(firstName, lastName, username, password, email) {
    firstName = validation.checkString(firstName, 'firstName');
    lastName = validation.checkString(lastName, 'lastName');
    username = await checkUsername(username);
    password = checkPassword(password);
    email = validation.checkString(email, 'email');
    // TODO: Verify that email is of the proper format and has not been registered

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
    const id = insertInfo.insertedId.toString();

    const user = await this.getUser(id);
    user._id = user._id.toString();
    return user;
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
    username = await checkUsername(username);

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
    password = checkPassword(password);

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

// TODO: Add function(s) to update a user's firstName, lastName, and email as deemed necessary

module.exports = {
    getUser,
    getAllUsers,
    createUser,
    removeUser,
    updateUsername,
    updatePassword
}