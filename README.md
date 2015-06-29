DEPRECATED  Incompatible with dualapi 1.x.

# Client pool for dualapi.

Extends a dualapi domain with a multiplexer for `socket.io` connections.

## Connecting

Given a dualapi domain
```javascript
var domain = dualapi();
```

Extend the domain with the `connect` method:
```javascript
var clientpool = require('dual-clientpool');
domain = clientpool(domain, ['ready']);
```

When a client connects, connect the socket to the domain:
```javascript
io.listen().on('connect', function (socket) {
    domain.connect(socket);
});
```

## Connection response
The client is given a unique mount point in the domain such as
`['client', xxxxx]`, where `xxxxx` is a unique id.  The server then
sends `['ready']`, to the `['index']` host on the client.


## Disconnect

When the client disconnects, a message is sent to `['disconnect',
'client', xxxxx]` on the server.

