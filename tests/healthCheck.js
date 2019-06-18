/* jslint node: true */
/* jshint esversion: 8 */
'use strict';

const client = require('../clients/api/HealthClient');
client.isActive({}, (error, healthResponse) => {
    if (error) {
        return console.log('API Service is Down bro!');
    }

    console.log(healthResponse);
});
