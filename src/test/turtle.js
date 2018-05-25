'use strict';

const rosnodejs = require('rosnodejs');
const nodeMgr = require('../../rosnodes/nodeManager');

let turtlesimPid = nodeMgr.simpleSpawn('roslaunch', ['tr05_controller', 'tr05_controller.launch']);
let turtlesimPid = nodeMgr.simpleSpawn('roslaunch', ['tr05_navigation', 'tr05_mapping.launch']);

rosnodejs.initNode('/my_node', {
    onTheFly: true
}).then((rosNode) => {

    // get list of existing publishers, subscribers, and services
    /*
    rosNode._node._masterApi.getSystemState("/my_node").then((data) => {
        console.log("getSystemState, result", data, data.publishers[0]);
    });
    */

    // ---------------------------------------------------------
    // Service Call
    /*
    const TeleportRelative = rosnodejs.require('turtlesim').srv.TeleportRelative;
    const teleport_request = new TeleportRelative.Request({
        linear: 0,
        angular: 0.0
    });

    let serviceClient = rosNode.serviceClient("/turtle1/teleport_relative",
        "turtlesim/TeleportRelative");

    rosNode.waitForService(serviceClient.getService(), 2000)
        .then((available) => {
            if (available) {
                serviceClient.call(teleport_request, (resp) => {
                    console.log('Service response ' + JSON.stringify(resp));
                });
            } else {
                console.log('Service not available');
            }
        });
    */

    // ---------------------------------------------------------
    // Subscribe
    /*
    rosNode.subscribe(
        '/turtle1/pose',
        'turtlesim/Pose',
        (data) => {
            console.log('pose', data);
        }, {
            queueSize: 1,
            throttleMs: 2000
        });
        */

    // ---------------------------------------------------------
    // Publish
    // equivalent to:
    //   rostopic pub /turtle1/cmd_vel geometry_msgs/Twist '[1, 0, 0]' '[0, 0, 0]'
    let cmd_vel = rosNode.advertise('/turtle1/cmd_vel', 'geometry_msgs/Twist', {
        queueSize: 1,
        latching: true,
        throttleMs: 0
    });

    const Twist = rosnodejs.require('geometry_msgs').msg.Twist;
    const msgTwist = new Twist({
        linear: {
            x: 10,
            y: 0,
            z: 0
        }
        // ,
        // angular: {
        //     x: 0,
        //     y: 0,
        //     z: 2
        // }
    });
    cmd_vel.publish(msgTwist);

    setTimeout(() => {
        nodeMgr.killSpawn(turtlesimPid);
    }, 3000);

    // ---------------------------------------------------------
    // test actionlib
    // rosrun turtlesim turtlesim_node
    // rosrun turtle_actionlib shape_server

    // wait two seconds for previous example to complete
    /*
    setTimeout(function () {
        const shapeActionGoal = rosnodejs.require('turtle_actionlib').msg.ShapeActionGoal;
        const ac = rosnodejs.nh.actionClient(
            "/turtle_shape",
            "turtle_actionlib/ShapeAction"
        );
        ac.sendGoal(new shapeActionGoal({
            goal: {
                edges: 3,
                radius: 1
            }
        }));
        setTimeout(function () {
            ac.cancel();
        }, 1000);
    }, 2000);
    */

    // ---------------------------------------------------------
    // test int64 + uint64
    /*
    rosNode.subscribe(
        '/int64',
        'std_msgs/Int64',
        (data) => {
            console.log('int64', data);
        }, {
            queueSize: 1,
            throttleMs: 1000
        });

    let int64pub = rosNode.advertise('/int64', 'std_msgs/Int64', {
        queueSize: 1,
        latching: true,
        throttleMs: 9
    });
    const Int64 = rosnodejs.require('std_msgs').msg.Int64;
    int64pub.publish(new Int64({
        data: "429496729456789012"
    }));

    rosNode.subscribe(
        '/uint64',
        'std_msgs/UInt64',
        (data) => {
            console.log('uint64', data);
        }, {
            queueSize: 1,
            throttleMs: 1000
        });

    let uint64pub = rosNode.advertise('/uint64', 'std_msgs/UInt64', {
        queueSize: 1,
        latching: true,
        throttleMs: 9
    });
    const UInt64 = rosnodejs.require('std_msgs').msg.UInt64;
    uint64pub.publish(new UInt64({
        data: "9223372036854775807"
    }));
    */
});