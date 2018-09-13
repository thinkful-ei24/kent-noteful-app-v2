'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const hydrateNotes = require('../utils/hydrateNotes');

const getAllNotes = function() {
  return knex
    .select('notes.id', 'title', 'content',
      'folders.id as folderId', 'folders.name as folderName',
      'tags.id as tagId', 'tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'notes_tags.tag_id', 'tags.id');
};

const getNoteById = function(noteId) {
  return getAllNotes().where('notes.id', noteId);
};

// Read all notes
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId } = req.query;

  getAllNotes()
    .modify(function (queryBuilder) {
      if (searchTerm) queryBuilder.where('title', 'like', `%${searchTerm}%`);
    })  
    .modify(function (queryBuilder) {
      if (folderId) queryBuilder.where('folder_id', folderId);
    })
    .modify(function (queryBuilder) {
      if (tagId) queryBuilder.where('tag_id', tagId);
    })
    .orderBy('notes.id')
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Read note by id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  getNoteById(id)
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result)[0];
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Create note
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;

  const newItem = { 
    title, 
    content,
    folder_id: folderId
  };

  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  let noteId;

  knex.insert(newItem).into('notes').returning('id')
    .then(([id]) => {
      noteId = id;
      const tagsInsert = tags.map(tagId => ({ note_id: noteId, tag_id: tagId }));
      return knex.insert(tagsInsert).into('notes_tags');
    })
    .then(() => getNoteById(noteId))
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result)[0];
        res.location(`${req.originalUrl}/${hydrated.id}`).status(201).json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Update note
router.put('/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  /***** Never trust users - validate input *****/
  const updateObj = {
    title: title,
    content: content,
    folder_id: (folderId) ? folderId : null
  };

  knex('notes').update(updateObj).where({'notes.id': noteId})
    .then(() => knex.del().from('notes_tags').where({note_id: noteId}))
    .then(() => {
      const tagsInsert = tags.map(tagId => ({ note_id: noteId, tag_id: tagId }));
      console.log('running');
      console.log('tags: ' + tags);
      return knex.insert(tagsInsert).into('notes_tags');
    })
    .then(() => getNoteById(noteId))
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result)[0];
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Delete note
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes').del().where({id})
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

module.exports = router;
