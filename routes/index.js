// EXAMPLE: const userApiRoutes = require('./userApi');
// TODO: const _____ = require('_____');

const constructorMethod = (app) => {
  // EXAMPLE: app.use('/', userApiRoutes);
  // TODO: app.use('/', _____);

  // TODO: Add other routes as necessary

  app.use('*', (req, res) => {
    // EXAMPLE: res.status(404).json({ error: 'Not found' });
    // TODO: Decide what to do for unspecified routes
  });
};

module.exports = constructorMethod;