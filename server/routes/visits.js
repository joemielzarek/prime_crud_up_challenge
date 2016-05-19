var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/mu';

router.get('/:id', function (req, res) {
var id = req.params.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT check_out FROM visits ' +
                  'WHERE id = $1',
                  [id],
      function(err, result) {
      done();
      console.log(result.rows);

      res.send(result.rows);

    });
  });
});

module.exports = router;
