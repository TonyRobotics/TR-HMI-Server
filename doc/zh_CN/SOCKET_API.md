# TR HMI 实时通讯 API

## 一、切换底盘工作模式

> 发送 topic: `/launch_mode`

- request 参数

    ```json
    {
        "mode":"control"
    }
    ```

- 参数说明：
  - `control`: 遥控模式
  - `mapping`: 建图模式
  - `navigation`: 导航模式

## 二、运动控制

> 发送 topic: `/cmd_vel`

- request 参数

    ```json
    {
        "vx":1,
        "vt":-1
    }
    ```

- 参数说明
  - `vx`: 线速度值，正数为前进，负数为后退，取值区间应为 `[-maxVx,maxVx]`
  - `vt`: 角速度值，正数为右转，负数为左转，取值区间应为 `[-maxVt,maxVt]`

## 三、实时日志输出

### （一）、实时日志输出开启、关闭

> 发送 topic: `/rosout/cmd`

- request 参数：

    ```json
    {
        "method":"start"
    }
    ```
- 参数说明：
  - `start`: 启动实时日志输出
  - `stop`: 关闭实时日志输出

### （二）、监听实时日志输出

> 订阅 topic: `/rosout/data`

- data : string 类型实时日志

## 四、实时机器人位置

> 监听 topic: `/global/map/position`

- data: ros `nav_msgs/Odometry` 对象

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
                "x": -3.25253647864, // UI 展示
                "y": -1.03167062472, //UI 展示
                "z": 0.0 //UI 展示
            },
            "orientation": {
                "x": 0.0, //UI 展示
                "y": -0.0, //UI 展示
                "z": -0.269944078072, //UI 展示
                "w": -0.962876001733 //UI 展示
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

## 五、目标点

### 1、地图目标点点击事件

> 监听 topic: `/global/map/goal/click`

- response:

```json
{
  //... ros `geometry_msgs/PoseStamped` 对象,
  //结构参考上述 Odometry
  //客户端不需处理此数据，只需在后续动作中原样回传即可；
}
```

### 2、设置目标点为初始点

> 发送 topic: `/global/map/goal/angle`

- request 参数：

```json
{
  "pose":{
    //... 监听点击事件得到的 PoseStamped 对象
  },
  "angle":180 //用户设定的方向
}
```

### 3、导航到目标点（导航模式）

> 发送topic: `/move_base_simple/goal`

- request 参数：

```json
{
  "pose":{
    //... 监听点击事件得到的 PoseStamped 对象
  }
}
```
