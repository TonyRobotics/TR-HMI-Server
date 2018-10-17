/**
 * TR HMI Core Service
 */

'use strict'

const rosControl = require('./roscontrol');
const restApp = require('./restful');
const servSocket = require('./socket');
const debounce = require('lodash.debounce');

//default server port
const PORT = 3000;

//check and config
require('./data/config').checkAndConfig();

//bind socket and register routers
let server = require('http').Server(restApp.callback()),
    io = require('socket.io')(server);
servSocket(io);

//default launch control mode
// rosControl.toggleRosLaunchMode(rosControl.MODE.CONTROL);

//running tr_hmi_node
rosControl.startHMIBridgeNode(rosnode => {
    console.log('tr_hmi_node started!');
});

//subscribe map click to set goal
rosControl.subscribeMapGoal(debounce(msg => {
    console.log('broadcasting click...');
    io.sockets.emit('/global/map/goal/click', msg);
}, 600));

//retransmission realtime odometry message
rosControl.subscribeOdom(msg => {
    io.sockets.emit('/global/map/position', msg);
});

//finally start the server
server.listen(process.env.PORT || PORT);
