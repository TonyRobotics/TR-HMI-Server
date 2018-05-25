# TR HMI 实时通讯 API

## Toggle robot launch file

> send to topic: `/launch_mode`

- request params

    ```json
    {
        "mode":"control"
    }
    ```

- available modes：
  - `control`: control mode, relative to `tr05_control.launch`
  - `mapping`: mapping mode ,relative to `tr05_mapping.launch`
  - `navigation`: navigation mode ,relative to `tr05_navigation.launch`

## Motion control

> send topic: `/cmd_vel`

- request params

    ```json
    {
        "vx":1,
        "vt":-1
    }
    ```

- about params
  - `vx`: linear speed
  - `vt`: angular speed

## rosout retransmission

### 1) enable/disable retransmission of rosout

> send topic: `/rosout/cmd`

- request params：

    ```json
    {
        "method":"start"
    }
    ```
- avaliable params ：
  - `start`: start retransmission
  - `stop`: stop retransmission

### 2) read content from rosout

> subscribe topic: `/rosout/data`

- data : rosout in string

## Position of robot

> subscribe topic: `/global/map/position`

- data: `nav_msgs/Odometry` object in ros

```json
{
    "header": {
        "seq": 1418,
        "stamp": {
            "secs": 1502268092,
            "nsecs": 930032885
        },
        "frame_id": "odom"
    },
    "child_frame_id": "base_link",
    "pose": {
        "pose": {
            "position": {
                "x": -3.25253647864,
                "y": -1.03167062472,
                "z": 0.0
            },
            "orientation": {
                "x": 0.0,
                "y": -0.0,
                "z": -0.269944078072,
                "w": -0.962876001733
            }
        },
        "covariance": []
    },
    "twist": {
        "twist": {
            "linear": {
                "x": 0.0,
                "y": 0.0,
                "z": 0.0
            },
            "angular": {
                "x": 0.0,
                "y": 0.0,
                "z": 0.0
            }
        },
        "covariance": []
    }
}
```

## Goal

### 1) click event on map

> subscribe topic: `/global/map/goal/click`

- response:

```json
{
  //... ros `geometry_msgs/PoseStamped` object,
  //the client side need not handle this data,just send back to the server side with the topic below.
}
```

### 2) set the clicked point as a navigation goal

> send topic: `/global/map/goal/angle`

- request params：

```json
{
  "pose":{
    //... the PoseStamped object received in the click topic
  },
  "angle":180 //user set orientation in degree.
}
```

### 3) realtime feedback of angle setting by user

> send topic: `/global/map/goal/angle_setting`

- request params:

```json
{
  "originalPose":{
    //...
  },
  "angle":180
}
```

### 4) start navigating to the given goal

> send topic: `/move_base_simple/goal`

- request params：

```json
{
  "pose":{
    //...
  }
}
```
