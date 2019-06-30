var mongo = require('mongodb').MongoClient;
var mongoURI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var collection;

/*function connect(func) {
  mongo.connect(mongoURI, function(err, db) {
    if (err) throw err;
    collection = db.collection(process.env.COLLECTION);
    func();
  })
}
function insert(doc) {
  collection.insert(doc, function(err, db) {
    if (err) throw err;
    db.close();
  })
}*/