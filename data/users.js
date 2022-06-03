const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

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
    const user = await userCollection.findOne({username: {$regex: new RegExp(`^${username}$`, 'i')}});
    if (user) {user._id = user._id.toString();};
    
    return user;
}

async function getUserByEmail(email) {
    email = validation.checkEmail(email);

    const userCollection = await users();
    const user = await userCollection.findOne({email: {$regex: new RegExp(`^${email}$`, 'i')}});
    if (user) {user._id = user._id.toString();};
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
    if (!user) throw 'Either the username or password is invalid.';

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) throw 'Either the username or password is invalid.';
    return {id: user._id};
}

async function confirmPassword(password1, password2, hash) {
    password1 = validation.checkPassword(password1);
    password2 = validation.checkPassword(password2);

    if (hash) {
        const compare = await bcrypt.compare(password2, password1);
        if (!compare) throw 'Password fields must match.';
    } else {
        if (password1 !== password2) throw 'Password fields must match.';
    }
    return password2;
}

async function createUser(firstName, lastName, username, password, email) {
    firstName = validation.checkString(firstName, 'first name');
    lastName = validation.checkString(lastName, 'last name');
    username = validation.checkUsername(username);
    password = validation.checkPassword(password);
    email = validation.checkEmail(email);

    if (await getUserByUsername(username)) throw 'Error: username is taken';
    if (await getUserByEmail(email)) throw 'Error: email is in use';

    const hash = await bcrypt.hash(password, saltRounds);
    const userCollection = await users();
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: hash,
        email: email
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
    username = validation.checkUsername(username);

    let user = await this.getUser(id);
    const currentUsername = user.username;
    if ((username.toLowerCase() !== currentUsername.toLowerCase()) && (await getUserByUsername(username))) throw 'Username is taken.';

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {username: username}}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not update username.';

    user = await this.getUser(id);
    return user;
}

async function updatePassword(id, password) {
    id = validation.checkId(id);
    password = validation.checkPassword(password);

    const hash = await bcrypt.hash(password, saltRounds);
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {password: hash}}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not update password';

    const user = await this.getUser(id);
    return user;
}

async function updateEmail(id, email) {
    id = validation.checkId(id);
    email = validation.checkEmail(email);

    let user = await this.getUser(id);
    const currentEmail = user.email;
    if ((email.toLowerCase() !== currentEmail.toLowerCase()) && (await getUserByEmail(email))) throw 'Email is in use.';

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {email: email}}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not update email.';

    user = await this.getUser(id);
    return user;
}

async function updateFirstName(id, firstName) {
    id = validation.checkId(id);
    firstName = validation.checkString(firstName);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {firstName: firstName}}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not update first name.';

    const user = await this.getUser(id);
    return user;
}

async function updateLastName(id, lastName) {
    id = validation.checkId(id);
    lastName = validation.checkString(lastName);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: {lastName: lastName}}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not update last name.';

    const user = await this.getUser(id);
    return user;
}

module.exports = {
    getUser,
    getUserByUsername,
    getUserByEmail,
    getAllUsers,
    checkUser,
    confirmPassword,
    createUser,
    removeUser,
    updateUsername,
    updatePassword,
    updateEmail,
    updateFirstName,
    updateLastName
}