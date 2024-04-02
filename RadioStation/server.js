var express = require('express');
var app = express();
var path = require('path');

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

//Local Variables to use
app.locals.siteName = "RWRP" // rock wave radio project

// Set up css files
app.use(express.static(path.join(__dirname, 'public')));

// index page
app.get('/', function(req, res) {
  res.render('pages/index', {
  });
});

// manager page
app.get('/manager', function (req, res) {
    res.render('pages/manager');
});

// producer page
app.get('/producer', function(req, res) {
  res.render('pages/producer');
});

// dj page
app.get('/dj', function (req, res) {
    res.render('pages/dj');
});

app.listen(8080);
console.log('Server is listening on port 8080');