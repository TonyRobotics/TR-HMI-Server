/**
 * TR HMI Core Service
 */

'use strict'

const rosControl = require('./roscontrol');
const restApp = require('./restful');
const servSocket = require('./socket');

//default server port
const PORT = 3000;

//bind socket and register routers
let server = require('http').Server(restApp.callback()),
    io = require('socket.io')(server);
servSocket(io);

//default launch control mode
// rosControl.toggleRosLaunchMode(rosControl.MODE.CONTROL);

//running tr_hmi_node
rosControl.startHMIBridgeNode((rosnode) => {
    console.log('tr_hmi_node started!');
});

//finally start the server
server.listen(process.env.PORT || PORT);