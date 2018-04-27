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
            "total": 7865.546875,//内存总量（MB）
            "free": 305.9140625, //空闲内存
            "freeMemPercentage": 0.03889291709293895 //空闲内存占比
        },
        "cpu": {
            "count": 4, //cpu 核心数
            "usage": 0.14360313315926898 //CPU 使用率
        },
        "disk": {
            "total": "50G", // 硬盘总量 GB
            "free": "39G", // 可用
            "used": "8.2G", //已用
            "freeDiskPercentage": "83%" //剩余空间占比
        },
        "system": {
            "uptime": 26078, //开机时间 （秒）
            "loadavg": 1.32568359375 //负载
        }
    }
}
```