/*jslint node: true */
"use strict";

var uid = require('uid-safe');

module.exports = function (domain, indexroute) {

    domain.connect = function (socket) {
        uid(24)
            .then(function (clientid) {
                var clientRoute = ['client', clientid];
                socket.on('disconnect', function () {
                    domain.send(['disconnect'].concat(clientRoute));
                });
                domain.open(clientRoute, socket);
                domain.send(['connect'].concat(clientRoute), []);
                domain.send(clientRoute.concat('index'), indexroute);
            });
    };

    return domain;
};
