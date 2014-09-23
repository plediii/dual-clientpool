/*jslint node: true */
"use strict";

var dualapi = require('dualapi');
var uid = require('uid-safe');

module.exports = function (indexroute) {

    var c = dualapi({ delimiter: '/'});
    c.connect = function (socket) {
        uid(24)
            .then(function (clientid) {
                var clientRoute = ['client', clientid];
                socket.on('disconnect', function () {
                    c.send(['disconnect'].concat(clientRoute));
                });
                c.open(clientRoute, socket);
                c.send(clientRoute.concat('index'), indexroute);
            });
    };

    return c;
};
