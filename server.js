// server.js
// where your node app starts

// init project
var express = require('express');
var valid = require('valid-url');
//var mongofuncs = require('./mongofuncs');
var app = express();
var mongo = require('mongodb').MongoClient;
var mongoURI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'.mlab.com:'+process.env.DB_PORT+'/'+process.env.DB;
var nunjucks = require('nunjucks');
nunjucks.configure('views', { autoescape: true, express: app });
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.render('index.html', {
    title: "Welcome!"
  });
});
app.get('/new/:URLTO(*)', function(req, res) {
  var url = req.params.URLTO.toString();
  if (valid.isUri(url)) {
    var shortened = Math.floor(Math.random() * (10000 - 999) + 999);
    shortened = 'https://url-shortener-guava.glitch.me/goto/'+shortened.toString();
    mongo.connect(mongoURI, function(err, client) {
      if (err) throw err;
      const db = client.db(process.env.DB);
      var collection = db.collection(process.env.COLLECTION);
      var doc = {
        url: url, 
        shortened: shortened
      };
      collection.insertOne(doc, function(err) {
        if (err) throw err;
        res.send(JSON.stringify({url, shortened}));
        client.close();
      })
    });
  } else {
    res.send(JSON.stringify({error: 'invalid URL format (http(s)://www.example.com)'}));
  }
  
});
app.get('/goto/:URLTO', function(req, res) {
  var red;
  mongo.connect(mongoURI, function(err, client) {
    if (err) throw err;
    const db = client.db(process.env.DB);
    var collection = db.collection(process.env.COLLECTION);
    collection.find( {
      shortened: 'https://url-shortener-guava.glitch.me/goto/'+req.params.URLTO.toString()
    }, {
      url:1,
      shortened:1,
      _id:0
    }).toArray(function(err, data) {
      if (err) throw err;
      //res.send(JSON.parse(JSON.stringify(data[0])).url);
      red = JSON.parse(JSON.stringify(data[0])).url;//.url;
      //console.log(red);
      client.close();
      res.writeHead(301, { Location: red });
      res.end();
    })
  })
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});