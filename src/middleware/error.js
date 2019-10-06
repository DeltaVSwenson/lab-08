'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let error = { error: err };
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  res.end();
};