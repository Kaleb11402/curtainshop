'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const db = {};

// Create a Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Read all files in the models directory and import them
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js') // Exclude index.js itself
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associate the models (if you have associations, e.g., `User.hasMany(Order)`)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize instance to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
