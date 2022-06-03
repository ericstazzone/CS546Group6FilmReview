const dbConnection = require('./mongoConnection');

/* Allows one reference to each collection per app */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* List all collections here */
module.exports = {
  users: getCollectionFn('users'),
  reviews: getCollectionFn('reviews')
};