var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/mu';

router.post('/', function(req, res) {
  var owner = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO owners (first_name, last_name) ' +
                    'VALUES ($1, $2)', [owner.firstName, owner.lastName],
                  function(err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(201);
                  }
                );
  });
});

module.exports = router;
