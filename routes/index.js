const userRoutes = require('./users');
const reviewRoutes = require('./reviews');
const commentRoutes = require('./comments');

const constructorMethod = (app) => {
  // EXAMPLE: app.use('/', userApiRoutes);
  //          app.use('_____', _____);
  app.use('/', userRoutes); 
  app.use('/reviews',reviewRoutes);
  app.use('/comments', commentRoutes);
  app.use('*', (req, res) => {
    res.status(404).redirect('/home');
  });
};

module.exports = constructorMethod;