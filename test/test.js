/*jslint node: true */
"use strict";

var dualapi = require('dualapi');
var clientpool = require('../index');
var assert = require('assert');
var _ = require('underscore');
var io = require('./mock-io');

describe('dual client pool', function () {

    it('should respond with index event when ready', function (done) {
        var c = clientpool(['robinhood']);
        var socket = io.socket();
        socket.sideB.on('dual', function (msg) {
            assert.deepEqual(msg.to, ['index']);
            assert.deepEqual(msg.from, ['robinhood']);
            done();
        });
        c.connect(socket.sideA);
    });

    it('should allow clients to send to mounted routes', function (done) {
        var c = clientpool(['patience']);
        c.mount(['dalek'], function (msg) {
            assert.equal(msg.from[0], 'client');
            assert.equal(msg.from[2], 'queen');
            assert.equal(msg.body, 'doctor');
            done();
        });

        var sendDual;
        var socket = io.socket();
        socket.sideB.on('dual', function () {
            socket.sideB.emit('dual', {
                to: ['dalek']
                , from: ['queen']
                , body: 'doctor'
            });
        });
        c.connect(socket.sideA);

    });

    it('should give each client a unique id', function (done) {
        var clients = [];
        var c = clientpool(['manage']);
        c.mount(['amazing'], function (msg) {
            clients.push(msg.from[1]);
            if (clients.length > 1) {
                assert.equal(2, _.uniq(clients).length);
                done();
            }
        });

        var sendFirst;
        var firstSocket = io.socket();
        firstSocket.sideB.on('dual', function () {
            firstSocket.sideB.emit('dual', {
                to: ['amazing']
                , from: ['sufficient']
                , body: 'power'
            });
        });
        c.connect(firstSocket.sideA);

        var secondSocket = io.socket();
        secondSocket.sideB.on('dual', function () {
            secondSocket.sideB.emit('dual', {
                to: ['amazing']
                , from: ['sufficient']
                , body: 'power'
            });
        });
        c.connect(secondSocket.sideA);
    });

    it('should send a disconnect message when client disconnects', function (done) {
        var c = clientpool(['robinhood']);
        var clientRoute;
        c.mount(['identify'], function (ctxt) {
            c.mount(['disconnect'].concat(ctxt.from), function (ctxt) {
                done();
            });
        });

        var socket = io.socket();
        socket.sideB.on('dual', function () {
            socket.sideB.emit('dual', {
                to: ['identify']
                , from: []
                , body: null
            });
            socket.sideB.emit('disconnect');
        });
        c.connect(socket.sideA);
    });


});
