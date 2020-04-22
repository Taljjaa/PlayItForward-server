const Sequelize = require('sequelize');

const sequelize = new Sequelize('pif', 'postgres', 'postgres', {
  dialect: 'postgres',
  underscored: true,
});

const models = {
  event: sequelize.import('./event'),
  nonprofit: sequelize.import('./nonprofit'),
  volunteer: sequelize.import('./volunteer'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
