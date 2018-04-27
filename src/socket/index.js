const controllers = require('./controllers');
const rosLogger = require('../utils/rosout');

/**
 * 注册 socket io 业务路由
 * @param io main io instance,like `const io = require('socket.io')(http);`
 */
function registerRouters(io) {
    io.on('connection', function (client) {
        client.on('connection', () => {
            console.log('+ 1 client connected');
        });
        client.on('disconnect', () => {
            console.log('- 1 client disconnected');
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
    });
}

module.exports = registerRouters;