'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const router = express.Router();
const Categories = require('../src/models/categories');
const categories = new Categories();
const auth = require('../src/auth/middleware');

// Esoteric Resources
router.get('/api/v1/categories',auth(), getCategories);
router.post('/api/v1/categories',auth('create'), postCategories);
router.get('/api/v1/categories/:id',auth('read'), getCategory);
router.put('/api/v1/categories/:id',auth('update'), putCategories);
router.delete('/api/v1/categories/:id',auth('delete'), deleteCategories);

// Prepare the express router


// router Level MW
router.use(cors());
router.use(morgan('dev'));

router.use(express.json());
router.use(express.urlencoded({extended:true}));


function getCategories(request,response,next) {
  // expects an array of object to be returned from the model
  categories.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

function getCategory(request,response,next) {
  // expects an array with the one matching record from the model
  categories.get(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function postCategories(request,response,next) {
  // expects the record that was just added to the database
  categories.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}


function putCategories(request,response,next) {
  // expects the record that was just updated in the database
  categories.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function deleteCategories(request,response,next) {
  // Expects no return value (resource was deleted)
  categories.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports=router;