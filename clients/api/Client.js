/* jslint node: true */
/* jshint esversion: 8 */
'use strict';

const grpc = require('grpc');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const protoLoader = require('@grpc/proto-loader');

dotenvExpand(dotenv.config());

const GRPC_SERVER_PORT = process.env.GRPC_SERVER_PORT;

const SERVICE_NAME = 'api';
const PROTO_BASE_DIR = process.env.PROTO_BASE_DIR;

const packageDefinition = protoLoader.loadSync(`${PROTO_BASE_DIR}/${SERVICE_NAME}.proto`);
const APIService = grpc.loadPackageDefinition(packageDefinition).APIService;
module.exports = new APIService(`localhost:${GRPC_SERVER_PORT}`, grpc.credentials.createInsecure());
