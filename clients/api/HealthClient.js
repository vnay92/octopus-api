/* jslint node: true */
/* jshint esversion: 8 */
'use strict';

const grpc = require('grpc');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const protoLoader = require('@grpc/proto-loader');

dotenvExpand(dotenv.config());

const SERVICE_NAME = 'health';
const PROTO_BASE_DIR = process.env.PROTO_BASE_DIR;

const packageDefinition = protoLoader.loadSync(`${PROTO_BASE_DIR}/${SERVICE_NAME}.proto`);
const HealthService = grpc.loadPackageDefinition(packageDefinition).HealthService;
module.exports = new HealthService('localhost:50051', grpc.credentials.createInsecure());
