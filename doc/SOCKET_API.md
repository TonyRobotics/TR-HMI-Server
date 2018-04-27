# TR HMI 实时通讯 API

## 一、切换底盘工作模式

> topic: `/launch_mode`

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

> topic: `/cmd_vel`

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