/**
 * 初始点设置
 * @author Dominic
 */

'use strict'

//geometry_msgs/PoseWithCovarianceStamped
const rosnodejs = require('rosnodejs');
const PoseWithCovarianceStamped = rosnodejs.require('geometry_msgs').msg.PoseWithCovarianceStamped;
const PoseWithCovariance = rosnodejs.require('geometry_msgs').msg.PoseWithCovariance;
const Quaternion = rosnodejs.require('geometry_msgs').msg.Quaternion;

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
 * @param inPoseStamped 带有位置信息的 postStamped msg
 * @param angel 前端设定的方向 （角度）
 * @param rosNode 宿主node(tr_hmi_node)
 */
function pubInitialPose(inPoseStamped, angle, rosNode) {
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

    //convert angle to orientation(geometry_msgs/Quaternion.msg)
    inPoseStamped.pose.orientation = eularAngleToQuaternion(0, 0, angle / 180 * Math.PI);

    let _covariance = new Float64Array(36).fill(0.0, 0, 35);

    let _poseWithCovariance = new PoseWithCovariance({
        pose: inPoseStamped.pose,
        covariance: _covariance
    });

    let _poseWithCovarianceStamped = new PoseWithCovarianceStamped({
        header: inPoseStamped.header,
        pose: _poseWithCovariance
    });

    // console.log('>>> _poseWithCovarianceStamped:', JSON.stringify(_poseWithCovarianceStamped));

    initialPose.publish(_poseWithCovarianceStamped);
}

/**
 * 欧拉角转换四元数
 */
function eularAngleToQuaternion(pitch, roll, yaw) {
    let q = new Quaternion();

    // Abbreviations for the various angular functions
    let cy = Math.cos(yaw * 0.5);
    let sy = Math.sin(yaw * 0.5);
    let cr = Math.cos(roll * 0.5);
    let sr = Math.sin(roll * 0.5);
    let cp = Math.cos(pitch * 0.5);
    let sp = Math.sin(pitch * 0.5);

    q.w = cy * cr * cp + sy * sr * sp;
    q.x = cy * sr * cp - sy * cr * sp;
    q.y = cy * cr * sp + sy * sr * cp;
    q.z = sy * cr * cp - cy * sr * sp;

    return q;
}

module.exports.pubInitialPose = pubInitialPose;