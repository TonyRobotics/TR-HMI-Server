/**
 * ROS 数学计算工具类
 * 
 * @author Dominic
 */

'use strict'

const rosnodejs = require('rosnodejs');
const Quaternion = rosnodejs.require('geometry_msgs').msg.Quaternion;

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

module.exports.eularAngleToQuaternion = eularAngleToQuaternion;