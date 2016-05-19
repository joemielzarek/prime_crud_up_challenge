var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var index = require('./routes/index');
var owners = require('./routes/owners');
var pets = require('./routes/pets');
var visits = require('./routes/visits');


app.use(bodyParser.urlencoded({extended: true}));
//Routes

app.use('/owners', owners);
app.use('/pets', pets);
app.use('/visits', visits);

app.use('/', index);


//Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
  console.log('Listening on port: ', app.get('port'));
});
