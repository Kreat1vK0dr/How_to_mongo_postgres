var express = require('express');
var path = require('path');
var app = express();
var routes = require('./how_to_mongo');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

//CORS - cross origin resources.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method == 'OPTIONS') {
      res.sendStatus(200);
    }
    else {
      next();
    }
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

// error handlers
var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

module.exports = app;
