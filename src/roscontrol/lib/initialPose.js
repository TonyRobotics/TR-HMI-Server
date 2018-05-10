/**
 * 初始点设置
 * @author Dominic
 */

'use strict'

const rosnodejs = require('rosnodejs');
const PoseWithCovarianceStamped = rosnodejs.require('geometry_msgs').msg.PoseWithCovarianceStamped;
const PoseWithCovariance = rosnodejs.require('geometry_msgs').msg.PoseWithCovariance;

let initialPose;

/**
 * 初始化
 * @param rosNode 宿主node(tr_hmi_node)
 */
function setUpCommand(rosNode) {
    initialPose = rosNode.advertise('/initialpose', 'geometry_msgs/PoseWithCovarianceStamped', {
        queueSize: 1,
        latching: true,
        throttleMs: 0
    });
}

/**
 * 发送 cmd_vel 指令，控制机器人运动
 * @param pose 带有位置信息的 postStamped msg
 * @param angel 前端设定的方向 （角度）
 * @param rosNode 宿主node(tr_hmi_node)
 */
function pubInitialPose(pose, angle, rosNode) {
    if (!rosNode) {
        rosNode = rosnodejs.nh;
        if (!rosNode) {
            console.error('could not get node handler for /initialpose');
            return;
        }
    }
    if (!initialPose) {
        setUpCommand(rosNode);
    }

    //TODO: convert angle to orientation(geometry_msgs/Quaternion.msg)
    //angle => _covariance
    let _covariance = new Float64Array([]);

    pose.pose.orientation.w = 1;

    // let _poseWithCovariance = new PoseWithCovariance({
    // })
    
    let _poseWithCovarianceStamped = new PoseWithCovarianceStamped({
        // header: {
        //     seq: 1,
        //     stamp: {
        //         secs: 0,
        //         nsecs: 0
        //     },
        //     frame_id: "map"
        // },
        'pose': pose
        // covariance: _covariance
    });

    initialPose.publish(_poseWithCovarianceStamped);

    console.log('publishing /initialPose:', _poseWithCovarianceStamped);
}

module.exports.pubInitialPose = pubInitialPose;