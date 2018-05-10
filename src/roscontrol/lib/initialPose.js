/**
 * 初始点设置
 * @author Dominic
 */

'use strict'

//geometry_msgs/PoseWithCovarianceStamped
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

    /*
 { pose:                                                                                                            
     { header: { seq: 2, stamp: [Object], frame_id: 'map' },                                                                            
       pose: { position: [Object], orientation: [Object] } },                                                                           
    angle: 244.6875 }       
    
  publishing /initialPose: PoseWithCovarianceStamped {                                                                                  
    header: Header { seq: 0, stamp: { secs: 0, nsecs: 0 }, frame_id: '' },                                                             
    pose:                                                                                                                               
     { header: { seq: 2, stamp: [Object], frame_id: 'map' },                                                                            
       pose: { position: [Object], orientation: [Object] } } } 
       
  rosControl-Pub:InitAngle: { pose:                                                                                                     
     { header: { seq: 2, stamp: [Object], frame_id: 'map' },                                                                            
       pose: { position: [Object], orientation: [Object] } },                                                                           
    angle: 244.6875 } 
    */

    //TODO: convert angle to orientation(geometry_msgs/Quaternion.msg)
    //angle => _covariance
    
    let _covariance = new Float64Array([]);

    pose.pose.orientation.w = 1;

    let _poseWithCovariance = new PoseWithCovariance({
        header: pose.header,
        pose: pose.pose
    });

    let _poseWithCovarianceStamped = new PoseWithCovarianceStamped({
        header: {
            frame_id: "map"
        },
        pose: _poseWithCovariance
    });

    initialPose.publish(_poseWithCovarianceStamped);

    console.log('publishing /initialPose:', JSON.stringify(_poseWithCovarianceStamped));
}

module.exports.pubInitialPose = pubInitialPose;