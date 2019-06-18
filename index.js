/* jslint node: true */
/* jshint esversion: 8 */
'use strict';

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv.config());

const PROTO_BASE_DIR = process.env.PROTO_BASE_DIR;
const SERVICE_NAME = 'api';

const grpc = require('grpc');
const uuidv1 = require('uuid/v1');
const apiProto = grpc.load(`${PROTO_BASE_DIR}/${SERVICE_NAME}.proto`);

const server = new grpc.Server();
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

server.addService(apiProto.APIService.service, {
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
});

const healthProto = grpc.load(`${PROTO_BASE_DIR}/health.proto`);
server.addService(healthProto.HealthService.service, {
    isActive: (_, callback) => {
        return callback(null, {
            isActive: true
        });
    }
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://0.0.0.0:50051');
server.start();
