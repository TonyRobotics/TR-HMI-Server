/**
 * ros 服务桥接管理,提供上层编排管理ros命令的功能；
 * @author Dominic
 */

'use strict'

const {
    simpleSpawn,
    killSpawn
} = require('../utils/simspawn');

const rosnodejs = require('rosnodejs');
const initialPose = require('./lib/initialPose');
const cmd_vel = require('./lib/cmd_vel');
const moveBaseSimpleGoal = require('./lib/move_base_simple_goal');
const runLaunch = require('./lib/runlaunch');
const tr_hmi_goalImg = require('./lib/tr_hmi_goalImg');

let currentLaunchPid,
    mapServerPid,
    mapSaverPid;

/**
 * ros launch x ,工作模式
 */
const MODE = {
    CONTROL: 'control',
    MAPPING: 'mapping',
    NAVIGATION: 'navigation'
}

/**
 * 启动 `tr_hmi_node` HMI 桥接服务节点
 * @param callback return the rosnode instance
 */
function startHMIBridgeNode(callback) {
    rosnodejs.initNode('/tr_hmi_node', {
        onTheFly: true
    }).then(callback);
}

/**
 * TODO: 根据不同底盘型号配置对应 launch 文件
 * 切换 tr 工作模式
 * @param mode TR 底盘现有三种工作模式, 
 *              `MODE.CONTROL`（遥控模式，默认），
 *              `MODE.MAPPING`（建图模式），
 *              `MODE.NAVIGATION`(导航模式)
 */
function toggleRosLaunchMode(mode) {
    if (currentLaunchPid) {
        killSpawn(currentLaunchPid);
        currentLaunchPid = null;
    }

    if (mode == MODE.CONTROL) {
        currentLaunchPid = simpleSpawn('roslaunch', ['able05_navigation', 'controller.launch']);
    } else if (mode == MODE.MAPPING) {
        currentLaunchPid = simpleSpawn('roslaunch', ['abel05_navigation', 'mapping.launch']);
    } else if (mode == MODE.NAVIGATION) {
        currentLaunchPid = simpleSpawn('roslaunch', ['abel05_navigation', 'navigation.launch']);
    } else {
        console.error('unrecognized mode:', mode);
    }
}

/**
 * 加载/切换地图
 */
function reloadMap(fullName, callback) {
    if (mapServerPid) {
        killSpawn(mapServerPid);
        mapServerPid = null;
    }
    mapServerPid = simpleSpawn('rosrun', ['map_server', 'map_server', `${fullName}`], callback);
}

/**
 * 保存地图
 * @param fullName full path and name 
 */
function saveMap(fullName) {
    if (mapSaverPid) {
        killSpawn(mapSaverPid);
        mapSaverPid = null;
    }
    mapSaverPid = simpleSpawn('rosrun', ['map_server', 'map_saver', '-f', fullName]);
}

/**
 * 监听地图点击目标点 
 */
function subscribeMapGoal(callback) {
    rosnodejs.nh.subscribe('/tr_hmi/goal', 'geometry_msgs/PoseStamped', callback);
}

/**
 * 监听机器人实时位置
 */
function subscribeOdom(callback) {
    rosnodejs.nh.subscribe('/odom', 'nav_msgs/Odometry', callback);
}

/**
 * 设置初始点
 */
function pubInitialPose(pose, angle) {
    initialPose.pubInitialPose(pose, angle, rosnodejs.nh);
}

/**
 * 发送移动控制
 */
function pubCmdVelMsg(vx, vt) {
    cmd_vel.pubCmdVelMsg(vx, vt, rosnodejs.nh);
}

/**
 * 发布导航目标点
 */
function pubMoveGoalMsg(pose) {
    moveBaseSimpleGoal.pubGoalMsg(pose, rosnodejs.nh);
}

module.exports = {
    'MODE': MODE,
    'startHMIBridgeNode': startHMIBridgeNode,
    'toggleRosLaunchMode': toggleRosLaunchMode,
    'reloadMap': reloadMap,
    'saveMap': saveMap,
    'subscribeMapGoal': subscribeMapGoal,
    'subscribeOdom': subscribeOdom,
    'pubInitialPose': pubInitialPose,
    'pubCmdVelMsg': pubCmdVelMsg,
    'pubMoveBaseSimpleGoalMsg': pubMoveGoalMsg,
    'runRosLaunch': runLaunch.runRosLaunch,
    'stopRosLaunch': runLaunch.stopRosLaunch,
    'pubAngleSettingMsg': tr_hmi_goalImg.pubAngleSettingMsg,
}