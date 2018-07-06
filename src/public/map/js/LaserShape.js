/**
 * @author Dominic.Y - hi@ydcool.me
 */

/**
 * A shape to draw a sensor_msgs/LaserScan msg
 *
 * @constructor
 * @param options - object with following keys:
 *   * message  - sensor_msgs/LaserScan message
 *   * colorfulIntensity (optional) - use colorful points to indentify intensity
 *   * pointSize (optional) - the size of the point
 *   * pointColor (optional) - the createjs color for the point
 *   * transform - transform of laser from tf transmations
 */
ROS2D.LaserShape = function (options) {
    options = options || {};
    this.message = options.message;
    this.scale = options.scale || 1;
    this.colorfulIntensity = options.colorfulIntensity || false;
    this.pointSize = options.pointSize || 1;
    this.pointColor = options.pointColor || createjs.Graphics.getRGB(255, 0, 0);
    this.transform = options.transform;

    this.graphics = new createjs.Graphics();

    var pose = new ROSLIB.Pose();
    if (this.transform) {
        pose.applyTransform(this.transform);
    }
    var tlX = pose.position.x;
    var tlY = pose.position.y;
    var currRotation = createjs.Stage.prototype.rosQuaternionToGlobalTheta.call(this, pose.orientation);
    console.log('transformedPose:', currRotation);

    var ranges = this.message.ranges;

    for (var i = 0; i < ranges.length; i++) {

        var r = ranges[i];

        if (r !== null && r >= this.message.range_min && r <= this.message.range_max) {
            var t = -currRotation + (i * this.message.angle_increment + this.message.angle_min);

            var x = r * Math.cos(t);
            var y = r * Math.sin(t);

            this.graphics.beginFill(this.pointColor).drawCircle(x + tlX, y + tlY, this.pointSize / this.scale);
        }
    }

    // create the shape
    createjs.Shape.call(this, this.graphics);
};

ROS2D.LaserShape.prototype.__proto__ = createjs.Shape.prototype;