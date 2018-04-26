const controllers = require('./controllers');

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
            console.log('- 1 client connected');
        });


        //set max speed
        client.on('/settings/speed', controllers.onSpeedSetting);

        //set default map
        client.on('/settings/map', controllers.onMapSetting);

        //toggle tr launch mode
        client.on('/launch_mode', controllers.onLaunchMode);

        //send cmd_vel to ros 
        client.on('/cmd_vel', controllers.onCmdVel);
    });
}

module.exports.registerRouters = registerRouters;