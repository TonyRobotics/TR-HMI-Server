const controllers = require('./controllers');
const rosLogger = require('../utils/rosout');
const rosCtrl = require('../roscontrol');

/**
 * 注册 socket io 业务路由
 * @param io main io instance,like `const io = require('socket.io')(http);`
 */
function registerRouters(io, callback) {
    io.on('connection', function (client) {
        client.on('connection', () => {
            console.log('SOCKET>>> + 1 client connected');
        });
        client.on('disconnect', () => {
            console.log('SOCKET>>> - 1 client disconnected');
        });

        //toggle tr launch mode
        client.on('/launch_mode', controllers.onLaunchMode);

        //send cmd_vel to ros 
        client.on('/cmd_vel', controllers.onCmdVel);

        //ros out
        client.on('/rosout/cmd', (req, fn) => {
            if (req.method && req.method == 'start') {
                rosLogger.startLogging((data) => {
                    client.emit('/rosout/data', data);
                });
                fn({
                    code: 200,
                    message: 'success'
                });
            } else if (req.method == 'stop') {
                rosLogger.stopLogging();
                fn({
                    code: 200,
                    message: 'success'
                })
            } else {
                fn({
                    code: 500,
                    message: 'failed: bad request'
                })
            }
        });

        //orientation set from client
        client.on('/global/map/goal/angle', (req, fn) => {
            if (req.pose && req.angle) {
                rosCtrl.pubInitialPose(req.pose, req.angle);
                fn({
                    code: 200,
                    message: 'success'
                })
            } else {
                fn({
                    code: 500,
                    message: 'failed: pose and angle all required'
                })
            }
        });

        if (callback) {
            callback(client);
        }
    });
}

module.exports = registerRouters;