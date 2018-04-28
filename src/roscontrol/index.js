/**
 * ros 服务桥接管理
 * @author Dominic
 */

'use strict'

const {
    simpleSpawn,
    killSpawn
} = require('../utils/simspawn');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const db = low(new FileSync(path.join(__dirname, '../data/db.json')));

const rosnodejs = require('rosnodejs');
const initialPose = require('./initialPose');

let currentLaunchPid,
    mapServerPid;

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
        currentLaunchPid = simpleSpawn('roslaunch', ['tr05_controller', 'tr05_controller.launch']);
    } else if (mode == MODE.MAPPING) {
        currentLaunchPid = simpleSpawn('roslaunch', ['tr05_navigation', 'tr05_mapping.launch']);
    } else if (mode == MODE.NAVIGATION) {
        currentLaunchPid = simpleSpawn('roslaunch', ['tr05_navigation', 'tr05_navigation.launch']);
    } else {
        console.error('unrecognized mode:', mode);
    }
}

/**
 * 加载/切换地图
 */
function reloadMap(mapName, callback) {
    if (mapServerPid) {
        killSpawn(mapServerPid);
        mapServerPid = null;
    }
    let mapDir = db.get('configs.mapsDir').value();
    mapServerPid = simpleSpawn('rosrun', ['map_server', 'map_server', `${path.join(mapDir,mapName)}`], callback);
}

/**
 * 监听地图点击目标点 
 */
function subscribeMapGoal(callback) {
    rosnodejs.nh.subscribe('/tr_hmi/goal', 'geometry_msgs/PoseStamped', callback);
}

/**
 * 设置初始点
 */
function pubInitialPose(pose, angle) {
    initialPose.pubInitialPose(pose, angle);
}

module.exports.MODE = MODE;
module.exports.startHMIBridgeNode = startHMIBridgeNode;
module.exports.toggleRosLaunchMode = toggleRosLaunchMode;
module.exports.reloadMap = reloadMap;
module.exports.subscribeMapGoal = subscribeMapGoal;
module.exports.pubInitialPose = pubInitialPose;