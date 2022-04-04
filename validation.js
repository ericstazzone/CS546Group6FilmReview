function checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'Error: id cannot be an empty string or just spaces';
    // TODO: Adjust line to check for necessary format
    if (!ObjectId.isValid(id)) throw 'Error: Invalid ObjectId';
    return id;
}

function checkString(string, parameter) {
    if (!string || typeof string != 'string' || string.trim().length == 0) throw `Error: ${parameter} must be a non-empty string`;
    return string.trim();
}

module.exports = {
    checkId,
    checkString
}