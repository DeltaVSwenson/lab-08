'use strict';

const {server} = require('../src/app');
const supergoose = require('./supergoose');
const mockRequest = supergoose(server);
const Roles = require('../src/auth/roles-model');
const Users = require('../src/auth/users-model'); 

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};
const capabilities = {
  admin: ['create','read','update','delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

beforeAll(async () => {
  await Promise.all(Object.entries(capabilities).map(entry => new Roles({role: entry[0], capabilities: entry[1]}).save()));
  await Promise.all(Object.values(users).map(user => new Users(user).save()));
});

describe('Categoies Model', () => {
  Object.keys(users).forEach( userType => {
    let token;
    beforeEach(async () => {
      token = await mockRequest.post('/signin')
        .auth(users[userType].username, users[userType].password)
        .then(results => results.text);
      //console.log(Generated token for ${username}: ${token});
    });
    describe(`${userType} users`, () => {
      it('returns with 200 if route is found', async () =>{
    
        return mockRequest
        
          .get('/api/v1/categories')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

      });
      it('can use the post method', ()=> {
        switch(userType){
        case 'admin':
        case 'editor':
          return mockRequest
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({name: 'haha', description: 'hehe'})
            .expect(200);
        }
      });
      it('can get obj from categories', ()=> {
        switch (userType) {
        case 'editor':
        case 'admin':
        case 'user':
          return mockRequest
            .get('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({name: 'haha', description: 'hehe'})
            .then(response =>{
              expect(response.body.count).toBeTruthy();
            });
        }
      });
      it('can update using put', ()=> {
        switch (userType){
        case 'editor':
        case 'admin':
          return mockRequest
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({name: 'haha', description: 'hehe'})
            .then( update =>{
              return mockRequest
                .put(`/api/v1/categories/${update.body._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({name:'tehe'})
                .then(response =>{
                //console.log(response);
                  expect(response.body.name).toBe('tehe');
                });
            });
        }
      });
      it('deletes the entry using delete method', ()=> {
        switch (userType){
        case 'admin':
          return mockRequest
            .get('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`)
            .then(response =>{
              expect(response.body.count).toBeTruthy();
              return mockRequest
                .delete(`/api/v1/categories/${response.body.results[0]._id}`)
                .set('Authorization', `Bearer ${token}`)
                .then(response => {
                  expect(response.body.deletedCount).toBeTruthy();
                });
            });
        }
      });
    
    });
  });
});



// describe('products Model', () => {
//   it('returns with 200 if route is found', async () =>{
    
//     return mockRequest
//       .get('/api/v1/products')
//       .expect(200);

//   });
//   it('can use the post method', ()=> {
//     return mockRequest
//       .post('/api/v1/products')
//       .send({name: 'haha', description: 'hehe'})
//       .expect(200);
//   });
//   it('can get obj from product', ()=> {
//     return mockRequest
//       .get('/api/v1/products')
//       .send({name: 'haha', description: 'hehe'})
//       .then(response =>{
//         expect(response.body.count).toBe(2);
//       });
//   });
//   it('can update using put', ()=> {

//     return mockRequest
//       .post('/api/v1/products')
//       .send({name: 'haha', description: 'hehe'})
//       .then( update =>{
//         return mockRequest
//           .put(`/api/v1/products/${update.body._id}`)
//           .send({name:'tehe'})
//           .then(response =>{
//             expect(response.body.name).toBe('tehe');
//           });
//       });
//   });
//   it('deletes the entry using delete method', ()=> {
//     return mockRequest
//       .get('/api/v1/products')
//       .then(response =>{
//         expect(response.body.count).toBe(3);
//         return mockRequest
//           .delete(`/api/v1/products/${response.body.results[0]._id}`)
//           .then(response => {
//             expect(response.body.deletedCount).toBe(1);
//           });
//       });
//   });
// });
