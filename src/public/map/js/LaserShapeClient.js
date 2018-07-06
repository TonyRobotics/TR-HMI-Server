/**
 * @author Dominic.Y - hi@ydcool.me
 */

/**
 * A points that listens to a given scan topic.
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the map topic to listen to
 *   * rootObject (optional) - the root object to add this marker to
 */
ROS2D.LaserShapeClient = function (options) {
    options = options || {};
    var that = this;
    var ros = options.ros;
    var topic = options.topic || '/scan';
    this.rootObject = options.rootObject || new createjs.Container();

    // subscribe to the LaserScan topic
    var rosLaserScanTopic = new ROSLIB.Topic({
        ros: ros,
        name: topic,
        messageType: 'sensor_msgs/LaserScan'
    });

    rosLaserScanTopic.subscribe(function (message) {
        var index = null;
        if (that.currentLaser) {
            index = that.rootObject.getChildIndex(that.currentLaser);
            that.rootObject.removeChild(that.currentLaser);
        }

        that.currentLaser = new ROS2D.LaserShape({
            pointSize: 2,
            message: message,
            scale: that.rootObject.scaleX || 1,
            transform: that.currentTransform,
        });

        if (index) {
            that.rootObject.addChildAt(that.currentLaser, index);
        } else {
            that.rootObject.addChild(that.currentLaser);
        }

        // console.log('/scan ==>', message);
    });

    var tfClient = new ROSLIB.TFClient({
        ros: ros,
        fixedFrame: 'map',
        angularThres: 0.01,
        transThres: 0.01
    });

    tfClient.subscribe('laser_link', function (tf) {
        console.log('laserlink:', tf);
        that.currentTransform = tf;
    });

    /*
    tfClient.subscribe('base_link', function (tf) {
        console.log('baselink:', tf);
    });

    tfClient.subscribe('odom', function (tf) {
        console.log('odom:', tf);
    });
    */
};

/**
 * compare two transform data.
 */
ROS2D.LaserShapeClient.prototype.compareTransform = function (tf_0, tf_1) {
    return tf_0.translation.x == tf_1.translation.x &&
        tf_0.translation.y == tf_1.translation.y &&
        tf_0.translation.z == tf_1.translation.z &&
        tf_0.rotation.x == tf_1.rotation.x &&
        tf_0.rotation.y == tf_1.rotation.y &&
        tf_0.rotation.z == tf_1.rotation.z &&
        tf_0.rotation.w == tf_1.rotation.w;
}

ROS2D.LaserShapeClient.prototype.__proto__ = EventEmitter2.prototype;