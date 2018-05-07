const rosControl = require('../roscontrol');
const rosLogger = require('../utils/rosout');

/**
 * 底盘 运动控制
 */
function onCmdVel(req, fn) {
    console.log('recived cmd_vel:', req);
    rosControl.pubCmdVelMsg(req.vx || 0, req.vt || 0);
}

/**
 * 切换运行模式
 */
function onLaunchMode(req, fn) {
    if (req.mode) {
        rosControl.toggleRosLaunchMode(req.mode);
        if (fn && typeof fn == 'function') {
            fn({
                code: 200,
                message: 'success'
            });
        }
    } else {
        if (fn && typeof fn == 'function') {
            fn({
                code: 500,
                message: 'failde: bad request'
            });
        }
        console.error('/launch_mode: invalid request data:', req);
    }
}

/**
 * 实时rosout 日志打印
 */
function onRosOutCmd(req, fn, client) {
    if (req.method && req.method == 'start') {
        rosLogger.startLogging((data) => {
            client.emit('/rosout/data', data);
        });
        if (fn && typeof fn == 'function') {
            fn({
                code: 200,
                message: 'success'
            });
        }
    } else if (req.method == 'stop') {
        rosLogger.stopLogging();
        if (fn && typeof fn == 'function') {
            fn({
                code: 200,
                message: 'success'
            })
        }
    } else {
        if (fn && typeof fn == 'function') {
            fn({
                code: 500,
                message: 'failed: bad request'
            })
        }
    }
}

/**
 * 初始点角度设置
 */
function onMapInitialAngle(req, fn) {
    if (req.pose && req.angle) {
        rosControl.pubInitialPose(req.pose, req.angle);
        console.log('rosControl-Pub:InitAngle:', req)
        if (fn && typeof fn == 'function') {
            fn({
                code: 200,
                message: 'success'
            })
        }
    } else {
        if (fn && typeof fn == 'function') {
            fn({
                code: 500,
                message: 'failed: pose and angle all required'
            })
        }
    }
}

/**
 * 设定导航目标点
 */
function onMoveBaseSimpleGoal(req, fn) {
    if (req.pose) {
        console.log('rosControl-Pub:moveBase Goal:', req)
        rosControl.pubMoveBaseSimpleGoalMsg(req.pose);
        if (fn && typeof fn == 'function') {
            fn({
                code: 200,
                message: 'success'
            });
        }
    } else {
        if (fn && typeof fn == 'function') {
            fn({
                code: 500,
                message: 'failed: pose required'
            });
        }
    }
}

module.exports = {
    'onLaunchMode': onLaunchMode,
    'onCmdVel': onCmdVel,
    'onRosOutCmd': onRosOutCmd,
    'onMapInitialAngle': onMapInitialAngle,
    'onMoveBaseSimpleGoal': onMoveBaseSimpleGoal,
}