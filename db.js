'use strict';

let Sequelize = require('sequelize');
let env = process.env.NODE_ENV || 'development';
let sequelize;

sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/data/shopify.sqlite'
});


const db = {};

db.app = sequelize.import(__dirname + '/models/app.js');
db.appReview = sequelize.import(__dirname + '/models/appReview.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// RELATIONSHIPS for user and account
db.appReview.belongsTo(db.app);
db.app.hasMany(db.appReview);


module.exports = db;