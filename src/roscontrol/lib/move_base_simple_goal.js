/**
 * 指定目标点并导航（导航模式）
 */

'use strict'

const rosnodejs = require('rosnodejs');
const PoseStamped = rosnodejs.require('geometry_msgs').msg.PoseStamped;

let goalMsg;

/**
 * 初始化
 * @param rosNode 宿主node(tr_hmi_node)
 */
function setUpCommand(rosNode) {
    goalMsg = rosNode.advertise('/move_base_simple/goal', 'geometry_msgs/PoseStamped', {
        queueSize: 1,
        latching: true,
        throttleMs: 0
    });
}

/**
 * 发布目标点
 */
function pubGoalMsg(poseStamped, rosNode) {
    if (!rosNode) {
        rosNode = rosnodejs.nh;
        if (!rosNode) {
            console.error('could not get node handler for /move_base_simple/goal');
            return;
        }
    }
    if (!goalMsg) {
        setUpCommand(rosNode);
    }

    //handle pose data
    try {
        poseStamped.pose.orientation.w = 1;
    } catch (e) {
        console.error(e);
    }

    goalMsg.publish(poseStamped);

    console.log('publishing /move_base_simple/goal :');
}

module.exports.pubGoalMsg = pubGoalMsg;