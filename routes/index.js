const userRoutes = require('./users');
const movieRoutes = require('./movies');
const reviewRoutes = require('./reviews');
const commentRoutes = require('./comments');

const constructorMethod = (app) => {
  // EXAMPLE: app.use('/', userApiRoutes);
  //          app.use('_____', _____);
  app.use('/', userRoutes); // This route is for testing purposes only
  // TODO: Add other routes as necessary

  app.use('*', (req, res) => {
    // EXAMPLE: res.status(404).json({ error: 'Not found' });
    // TODO: Decide what to do for unspecified routes
  });
};

module.exports = constructorMethod;