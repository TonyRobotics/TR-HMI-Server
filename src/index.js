/**
 * TR HMI Core Service
 */

'use strict'

const rosControl = require('./roscontrol');
const {
    registerRouters
} = require('./socket/router');

//default socket port
const PORT = 3000;

//bind socket and register routers
let server = require('http').Server(require('./restful').callback()),
    io = require('socket.io')(server);
registerRouters(io);

//default launch control mode
// rosControl.toggleRosLaunchMode(rosControl.MODE.CONTROL);

//running tr_hmi_node
rosControl.startHMIBridgeNode((rosnode) => {
    console.log('tr_hmi_node started!');
});

//finally start the server
server.listen(process.env.PORT || PORT);