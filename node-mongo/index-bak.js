const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/conFusion';

MongoClient.connect(url, (err, db) => {
  assert.equal(err, null); // check err is null
  console.log('Connected correctly to server');

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
        db.close();
      });
    });
  });
});
