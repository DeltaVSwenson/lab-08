'use strict';

// Where is our schema defined?
// How do we get it in here so we can run methods on it?
const Schema = require('./categories-schema');

class Categories {

  constructor() {
  }

  get(_id) {
    // Call the appropriate mongoose method to get
    // one or more records
    // If 1, return it as a plain object
    // If 2, return it as an object like this:
    // { count: ##, results: [{}, {}] }

    if (_id) {
      return Schema.findOne({_id: _id });
    } else {
      return Schema.find({});
    }
  }

  post(record) {
    // Call the appropriate mongoose method to create a new record
    let newRecord= new Schema(record);
    console.log(record, newRecord);
    return newRecord.save();
  }

  put(_id, record) {
    // Call the appropriate mongoose method to update a record
    return Schema.findByIdAndUpdate(_id, record, {new: true});
  }

  delete(_id) {
    // Call the appropriate mongoose method to delete a record
    if (_id){
      console.log(_id);
      return Schema.deleteOne({_id});
    }
  }

}

module.exports = Categories;
