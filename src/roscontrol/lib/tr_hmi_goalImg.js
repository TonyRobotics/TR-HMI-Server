/**
 * 设置初始点/目标点时，由 UI 向 ROS 发送实时角度,地图UI端接受并实时渲染显示反馈
 */

'use strict'

const rosnodejs = require('rosnodejs');
const PoseStamped = rosnodejs.require('geometry_msgs').msg.PoseStamped;
const rosMath = require('../../utils/rosMath');

let goalImgMsg;

/**
 * 初始化
 * @param rosNode 宿主node(tr_hmi_node)
 */
function setUpCommand(rosNode) {
    goalImgMsg = rosNode.advertise('/tr_hmi/goalImg', 'geometry_msgs/PoseStamped', {
        queueSize: 1,
        latching: true,
        throttleMs: 0
    });
}

/**
 * 发布目标点
 */
function pubAngleSettingMsg(data, rosNode) {
    if (!rosNode) {
        rosNode = rosnodejs.nh;
        if (!rosNode) {
            console.error('could not get node handler for /tr_hmi/goalImg');
            return;
        }
    }
    if (!goalImgMsg) {
        setUpCommand(rosNode);
    }

    //handle pose data
    if (data && data.originalPose && data.angle) {

        let poseStamped = new PoseStamped({
            pose: data.originalPose.pose,
            orientation: rosMath.eularAngleToQuaternion(0, 0, data.angle / 180 * Math.PI);
        });

        goalImgMsg.publish(poseStamped);
    } else {
        console.error('/tr_hmi/goalImg: invalid data:', data);
    }


    console.log('publishing /tr_hmi/goalImg :', poseStamped);
}

module.exports.pubGoalMsg = pubGoalMsg;