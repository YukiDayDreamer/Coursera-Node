const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// connection url
const url = 'mongodb://localhost:27017';
// database name
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
  assert.equal(err, null); // check err is null
  console.log('Connected correctly to server');

  const db = client.db(dbname);

  const collection = db.collection('dishes'); // build connection
  // insert one dish
  collection.insertOne({
    'name': 'Uthappizza',
    'description': 'test'
  }, (err, result) => {
    assert.equal(err, null);
    console.log('After Insert:\n');
    console.log(result.ops);

    // return all the documents
    collection.find({}).toArray((err, docs) => {
      assert.equal(err, null);

      console.log('Found:\n');
      console.log(docs);

      // drop the collection
      db.dropCollection('dishes', (err, docs) => {
        assert.equal(err, null);
        client.close();
      });
    });
  });
});
