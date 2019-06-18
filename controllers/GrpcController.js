/* jslint node: true */
/* jshint esversion: 8 */
'use strict';

const grpc = require('grpc');
const uuidv1 = require('uuid/v1');

const notes = [{
        id: '1',
        title: 'Note 1',
        content: 'Content 1'
    },
    {
        id: '2',
        title: 'Note 2',
        content: 'Content 2'
    }
];

module.exports = {
    listNotes: (_, callback) => {
        callback(null, notes);
    },
    getNoteById: (call, callback) => {
        let note = notes.find((n) => n.id == call.request.id);
        if (note) {
            return callback(null, note);
        }

        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found"
        });
    },
    createNote: (call, callback) => {
        let note = call.request;
        note.id = uuidv1();
        notes.push(note);
        callback(null, note);
    },
    updateNote: (call, callback) => {
        let existingNote = notes.find((n) => n.id == call.request.id);
        if (existingNote) {
            existingNote.title = call.request.title;
            existingNote.content = call.request.content;
            return callback(null, existingNote);
        }

        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found"
        });
    },
    deleteNoteById: (call, callback) => {
        let existingNoteIndex = notes.findIndex((n) => n.id == call.request.id);
        if (existingNoteIndex != -1) {
            notes.splice(existingNoteIndex, 1);
            return callback(null, {});
        }

        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found"
        });
    }
};
