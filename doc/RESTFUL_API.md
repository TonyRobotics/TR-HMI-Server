# TR HMI Service Restful API

## 一、设置相关

### （一）最大速度设置

1、 获取最大速度

- route: `/settings/maxSpeed`
- method: `GET`
- params:
- response body:

```json
{
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
    "method":"set",
    "data":{
        "maxVx":2,
        "maxVt":2
    }
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
    "data":{
        "defaultMap":"2015.ymal"
    }
}
```