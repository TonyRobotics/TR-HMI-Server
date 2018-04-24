# 基于 scoket.io 的通讯 API

## 一、设置相关

### （一）最大速度设置

> topic: `/settings/speed`

1. 获取速度设置

    - request 参数：
        ```json
        {
            "method":"get"
        }
        ```
    - 返回数值：
        ```json
        {
            "data":{
                "maxVx":2,
                "maxVt":2
            }
        }
        ```
2. 设置最大速度

    - requset 参数：
        ```json
        {
            "method":"set",
            "data":{
                "maxVx":2,
                "maxVt":2
            }
        }
        ```

### （二）默认地图设置

> topic: `/settings/map`

1. 获取默认地图

    - request 参数：
        ```json
        {
            "method":"get"
        }
        ```
    - 返回数值：
        ```json
        {
            "data":{
                "map":"2015.yaml"
         }
        }
        ```
2. 设置默认地图

    - requset 参数：
        ```json
        {
            "method":"set",
            "data":{
                "map":"2015.yaml"
            }
        }
        ```

## 二、切换底盘工作模式

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

## 三、运动控制

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