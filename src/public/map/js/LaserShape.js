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
 *   * translation (optional) - translation of laser from tf transmations
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

    // var currRotation = this.transform ? createjs.Stage.prototype.rosQuaternionToGlobalTheta.call(this, this.transform.rotation) : 0;
    // currRotation *= (Math.PI / 180);

    var tlX = this.transform ? this.transform.translation.x : 0;
    var tlY = this.transform ? this.transform.translation.y : 0;

    var ranges = this.message.ranges;

    for (var i = 0; i < ranges.length; i++) {

        var r = ranges[i];

        if (r !== null && r >= this.message.range_min && r <= this.message.range_max) {
            var t = (i * this.message.angle_increment + this.message.angle_min);

            var x = r * Math.cos(t);
            var y = r * Math.sin(t);

            this.graphics.beginFill(this.pointColor).drawCircle(x, y, this.pointSize / this.scale);
        }
    }

    // create the shape
    createjs.Shape.call(this, this.graphics);
};

ROS2D.LaserShape.prototype.__proto__ = createjs.Shape.prototype;