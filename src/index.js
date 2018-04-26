/**
 * TR HMI Service
 */

'use strict'

const lowDB = require('lowdb');
const http = require('http').Server();
const io = require('socket.io')(http);
const Koa = require('koa');
const app = new Koa();
const rosControl = require('./roscontrol');
const path = require('path');
const {
    registerRouters
} = require('./socket/router');

registerRouters(io);

//default socket port
const PORT = 3000;

//static web resources
// app.use(express.static(path.join(__dirname, 'public')));

//--------- start up steps ----------
//socket listening
http.listen(PORT);

//default launch control mode
// rosControl.toggleRosLaunchMode(rosControl.MODE.CONTROL);

//running tr_hmi_node
rosControl.startHMIBridgeNode((rosnode) => {
    console.log('tr_hmi_node started!');
});