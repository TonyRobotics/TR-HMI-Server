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