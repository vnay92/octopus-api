/* jslint node: true */
/* jshint esversion: 8 */
'use strict';

const client = require('../clients/api/Client');
client.listNotes({}, (error, notes) => {
    if (error) {
        return console.log('Error');
    }

    console.log(notes);
});
