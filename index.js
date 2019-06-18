/* jslint node: true */
/* jshint esversion: 8 */
'use strict';

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv.config());

const GRPC_SERVER_PORT = process.env.GRPC_SERVER_PORT;
const PROTO_BASE_DIR = process.env.PROTO_BASE_DIR;
const SERVICE_NAME = 'api';

const grpc = require('grpc');
const apiProto = grpc.load(`${PROTO_BASE_DIR}/${SERVICE_NAME}.proto`);

const grpcConrtoller = require('./controllers/GrpcController');

const server = new grpc.Server();
server.addService(apiProto.APIService.service, grpcConrtoller);

const healthProto = grpc.load(`${PROTO_BASE_DIR}/health.proto`);
server.addService(healthProto.HealthService.service, {
    isActive: (_, callback) => {
        return callback(null, {
            isActive: true
        });
    }
});

server.bind(`0.0.0.0:${GRPC_SERVER_PORT}`, grpc.ServerCredentials.createInsecure());
console.log(`gRPC Server running at 0.0.0.0:${GRPC_SERVER_PORT}`);
server.start();
