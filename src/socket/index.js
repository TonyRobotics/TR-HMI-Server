const controllers = require('./controllers');
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
            controllers.onRosOutCmd(req, fn, client);
        });

        //orientation set from client
        client.on('/global/map/goal/angle', controllers.onMapInitialAngle);

        client.on('/move_base_simple/goal', controllers.onMoveBaseSimpleGoal);

        client.on('/get_current_launch_mode', controllers.getCurrentLaunchMode);

        if (callback) {
            callback(client);
        }
    });
}

module.exports = registerRouters;