/*jshint esversion: 8*/
/*jslint node: true */
'use strict';

var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');

var env = dotenv.config();
dotenvExpand(env);
