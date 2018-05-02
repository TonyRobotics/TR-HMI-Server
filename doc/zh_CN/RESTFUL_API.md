# TR HMI Restful API

## 一、设置相关

### （一）最大速度设置

1、 获取最大速度

- route: `/settings/maxSpeed`
- method: `GET`
- params:
- response body:

```json
{
    "message":"success",
    "data":{
        "maxVx":2,
        "maxVt":2
    }
}
```

2、设置最大速度

- route:  `/settings/maxSpeed`
- method: `POST`
- request Body:

```json
{
    "maxVx":2,
    "maxVt":1
}

```

- response body:

```json
{
    "message":"success"
}
```

### （二）默认地图设置

1、 获取默认地图

- route: `/settings/defaultMap`
- method: `GET`
- params:
- response body：

```json
{
    "data":{
        "map":"2015.yaml"
    }
}
```

2、 设置默认地图

- route: `/settings/defaultMap`
- method：`POST`
- request body:

```json
{
    "mapName":"2015.yaml"
}
```

- reponse body:

```json
{
    "message":"success"
}
```

## 二、系统状态

### （一）、获取系统状态信息

- route: `/status/systemInfo`
- method: `GET`
- request:
- response body:

```json
{
    "message":"success",
    "data":{
        "mem": {
            "total": "7865.54MB",//内存总量（MB）
            "free": "305.91MB", //空闲内存
            "freeMemPercentage": "3.89%" //空闲内存占比
        },
        "cpu": {
            "count": 4, //cpu 核心数
            "usage": "14.36%" //CPU 使用率
        },
        "disk": {
            "total": "50G", // 硬盘总量 GB
            "free": "39G", // 可用
            "used": "8.2G", //已用
            "freeDiskPercentage": "83%" //剩余空间占比
        },
        "system": {
            "uptime": 326, //开机时间 （分钟）
            "loadavg": 1.32568359375 //负载
        }
    }
}
```

### （二）、获取 ROS 状态信息

- route: `/status/ros`
- method: `GET`
- request:
- response body:

```json
{
    "message": "success",
    "data": {
        "rosNodes": [ //正在运行中的 ros 节点列表
            "/rosout",
            "/tr_hmi_node"
        ],
        "rosServices": [ //正在运行中的 ros 服务列表
            "/tr_hmi_node/get_loggers",
        ]
    }
}
```

## 三、地图相关

### （一）、获取地图列表

- route: `/map/list`
- method: `GET`
- request:
- response body:

```json
{
    "message":"success",
    "data":{
        "maps":[
            "我的地图",
            "map2"
        ]
    }
}
```

### （二）、加载/切换地图

- route: `/map/load`
- method:`GET`
- query:
  - `mapName`: 地图名称 ，如 `mymap`
- response:

```json
{
    "message":"success"
}
```

### （三）、保存地图

- route: `/map/save`
- method: `POST`
- request body :

```json
{
    "mapName":"2105地图"
}
```

- response:

```json
{
    "message":"success"
}
```

### （四）、删除地图

- route: `/map/delete`
- method: `POST`
- request body:

```json
{
    "mapName":"2105地图"
}
```

- response body:

```json
{
    "message":"success"
}
```