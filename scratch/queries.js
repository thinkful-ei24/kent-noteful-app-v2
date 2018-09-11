'use strict';

const knex = require('../knex');

process.stdout.write('\x1Bc');
let id = '1003';
let searchTerm = 'gaga';
let newTitle = 'Nasdfes';
let newContent = 'New Content';

// Get All Notes accepts a searchTerm and finds notes with titles which contain the term. It returns an array of objects.

// knex('notes')
//   .select('notes.id', 'title', 'content')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(result => console.log(JSON.stringify(result, null, 2)))
//   .catch(err => console.error(err));

// get notes by ID

// knex('notes')
//   .select()
//   .where({id: id})
//   .first()
//   .then(row => console.log(JSON.stringify(row, null, 2)))
//   .catch(err => console.error(err));

// update notes by ID

// knex('notes')
//   .update({ 
//     title: newTitle, 
//     content: newContent
//   })
//   .where({id: id})
//   .returning(['id', 'title', 'content'])
//   .then(result => console.log(JSON.stringify(result[0], null, 2)))
//   .catch(err => console.error(err));

// Create a Note 
// knex('notes')
//   .insert({ 
//     title: newTitle, 
//     content: newContent
//   })
//   .returning(['id', 'title', 'content'])
//   .then(result => console.log(JSON.stringify(result[0], null, 2)))
//   .catch(err => console.error(err));

// Delete a Note by ID
knex('notes')
  .del()
  .where({id: id})
  .then(count => console.log(count))
  .catch(err => console.error(err));