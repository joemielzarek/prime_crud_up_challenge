var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/mu';

router.get('/', function (req, res) {

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT owners.first_name, owners.last_name, pets.id, name, breed, color, MAX(visits.id) FROM pets ' +
                	'LEFT OUTER JOIN visits ON pets.id = visits.pet_id ' +
	                'JOIN owners ON owners.id = pets.owner_id ' +
                  'GROUP BY pets.id, owners.id',
      function(err, result) {
      done();
      console.log(result.rows);

      res.send(result.rows);

    });
  });
});

router.post('/', function(req, res) {
  var pet = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO pets (name, breed, color, owner_id) ' +
                    'VALUES ($1, $2, $3, $4)', [pet.petName, pet.petBreed, pet.petColor, pet.ownerName],
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

router.put('/', function(req, res) {
  var pet = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE pets ' +
                  'SET name = $1, ' +
                  'breed = $2, ' +
                  'color = $3 ' +
                  'WHERE id = $4', [pet.petName, pet.petBreed, pet.petColor, pet.petId],
                  function(err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(200);
                  }
    );
  });
});

router.delete('/:id', function(req, res) {
  var id = req.params.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM pets ' +
                  'WHERE id = $1 ' ,
                  [id],
                  function(err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(200);
                  }
    );
  });
});

module.exports = router;
