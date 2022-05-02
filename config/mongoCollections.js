const dbConnection = require('./mongoConnection');

/* This will allow you to have one reference to each collection per app */
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

/* Now, you can list your collections here: */
module.exports = {
  users: getCollectionFn('users'),
  movies: getCollectionFn('movies'),
  reviews: getCollectionFn('reviews')
  // TODO: Do we need a collection for comments? Or should we configure comments.js in such a way that it draws from the reviews collection?
  // comments: getCollectionFn('comments')
};