const lowDB = require('lowdb');
const server = require('http').Server();
const io = require('socket.io')(server);
const rosControl = require('./roscontrol');

const {
    pubCmdVelMsg
} = require('./roscontrol/cmd_vel');

//default socket port
const PORT = 3000;

//tr_hmi_node instance
let trHMINode;

io.on('connection', function (client) {
    console.log('client connection!');

    client.on('disconnect', () => {
        console.log(`socket disconnneted.`)
    });

    //set max speed
    client.on('/settings/speed', (req, fn) => {
        if (req && req.method) {
            if (req.method == 'set') {
                //TODO: 持久化 req.data.maxVx , req.data.maxVt
                fn({
                    code: 200,
                    message: 'success'
                });
            } else if (req.method == 'get') {
                fn({
                    code: 200,
                    message: 'success',
                    data: {
                        maxVx: 2,
                        maxVt: 2
                    }
                });
            } else {
                fn({
                    code: 500,
                    message: 'bad request method'
                });
            }
        } else {
            fn({
                code: 500,
                message: 'bad request'
            });
            console.error('/settings/speed: invalid request data:', request);
        }
    })；

    //set default map
    client.on('/settings/map', (req, fn) => {
        if (req && req.method) {
            if (req.method == 'set') {
                //TODO: 持久化 req.data.map
                fn({
                    code: 200,
                    message: 'success'
                });
            } else if (req.method == 'get') {
                fn({
                    code: 200,
                    message: 'success',
                    data: {
                        map: '2105.yaml'
                    }
                });
            } else {
                fn({
                    code: 500,
                    message: 'bad request method'
                });
            }
        } else {
            fn({
                code: 500,
                message: 'bad request'
            });
            console.error('/settings/map: invalid request data:', request);
        }
    });

    //toggle tr launch mode
    client.on('/launch_mode', (request, fn) => {
        if (request.mode) {
            rosControl.toggleRosLaunchMode(request.mode);
            fn({
                code: 200,
                message: 'success'
            });
        } else {
            fn({
                code: 500,
                message: 'bad request'
            });
            console.error('/launch_mode: invalid request data:', request);
        }
    });

    //send cmd_vel to ros 
    client.on('/cmd_vel', (request, fn) => {
        if (request.vx && request.vt) {
            if (trHMINode) {
                pubCmdVelMsg(request.vx, request.vt, trHMINode);
            } else {
                console.error('tr hmi node instance not init!')
            }
        } else {
            console.error('/cmd_vel: invalid request data:', request);
        }
    });
});

//--------- start up steps ----------
//socket listening
server.listen(PORT);

//default launch control mode
rosControl.toggleRosLaunchMode(rosControl.MODE.CONTROL);

//running tr_hmi_node
rosControl.startHMIBridgeNode((rosnode) => {
    trHMINode = rosnode;
});