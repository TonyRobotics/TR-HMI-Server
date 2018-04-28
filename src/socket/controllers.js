const rosControl = require('../roscontrol');
const {
    pubCmdVelMsg
} = require('../roscontrol/cmd_vel');
const rosLogger = require('../utils/rosout');

/**
 * 底盘 运动控制
 */
function onCmdVel(req, fn) {
    if (req.vx && req.vt) {
        pubCmdVelMsg(req.vx, req.vt);
    } else {
        console.error('/cmd_vel: invalid request data:', req);
    }
}

/**
 * 切换运行模式
 */
function onLaunchMode(req, fn) {
    if (req.mode) {
        rosControl.toggleRosLaunchMode(req.mode);
        fn({
            code: 200,
            message: 'success'
        });
    } else {
        fn({
            code: 500,
            message: 'failde: bad request'
        });
        console.error('/launch_mode: invalid request data:', req);
    }
}



module.exports.onLaunchMode = onLaunchMode;
module.exports.onCmdVel = onCmdVel;