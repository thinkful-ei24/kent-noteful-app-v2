'use strict';

const knex = require('../knex');

// let searchTerm = 'gaga';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });


// get notes by ID
process.stdout.write('\x1Bc');

let id = '1005';
knex
  .select()
  .from('notes')
  .where({id: id})
  .then(results => console.log(JSON.stringify(results[0], null, 2)))
  .catch(err => console.error(err));