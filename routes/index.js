const express = require('express');


module.exports = (db) => {

  const router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {

    db.app.findAll().then(apps => {
      console.log(JSON.stringify(apps))
    });

    res.render('index', { title: 'Express' });
  });

  return router;
};