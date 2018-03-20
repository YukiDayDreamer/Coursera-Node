const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, {
  // useMongoClient: true  // not necessary for mongoose v5
});
connect.then((db) => {
  console.log('Connected correctly to server');
  var db = mongoose.connection; // set alias to db

  Dishes.create({
    name: 'Uthappizza',
    description: 'test'
  })
  .then((dish) => {
    console.log(dish);

    return Dishes.findByIdAndUpdate(dish._id, {
      $set: {description: 'Updated test'}, // update description
    },{
      new: true // return the new updated dish
    }).exec();
  })
  .then((dish) => {
    console.log(dish);

    dish.comments.push({
      rating: 5,
      comment: 'I\'m getting a sinking feeling!',
      author: 'Leonardo di Carpaccio'
    });

    return dish.save();
  })
  .then((dish)=>{
    console.log(dish);
    return db.collection('dishes').drop();
  })
  .then(()=>{
    return db.close();
  })
  .catch((err) =>{
    console.log(err);
  })

});
