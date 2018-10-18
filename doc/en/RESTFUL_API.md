# TR HMI Restful API

## Settings

### 1) maxSpeed

1\. get the max speed

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

2\. set the max speed

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

### 2) ~~defalut map~~

1\. get default map

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

2\. set default map

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

## System info

### 1) get system status info

- route: `/status/systemInfo`
- method: `GET`
- request:
- response body:

```json
{
    "message":"success",
    "data":{
        "mem": {
            "total": "7865.54MB",//total memory（MB）
            "free": "305.91MB", //free memory
            "freeMemPercentage": "3.89%" //free mem percentage
        },
        "cpu": {
            "count": 4, //number of cpu core
            "usage": "14.36%" //CPU usage in percentage
        },
        "disk": {
            "total": "50G", // total disk space in GB
            "free": "39G", // free disk space
            "used": "8.2G", //used disk space
            "usedDiskPercentage": "83%" //used disk space in percentage
        },
        "system": {
            "uptime": 326, //system uptime
            "loadavg": 1.32568359375 //load average
        }
    }
}
```

### 2) get ros status info

- route: `/status/ros`
- method: `GET`
- request:
- response body:

```json
{
    "message": "success",
    "data": {
        "rosNodes": [ //rosnode list
            "/rosout",
            "/tr_hmi_node"
        ],
        "rosServices": [ //rosservice list
            "/tr_hmi_node/get_loggers",
        ]
    }
}
```

## Map

### 1) get maps list

- route: `/map/list`
- method: `GET`
- request:
- response body:

```json
{
    "message":"success",
    "data":{
        "maps":[
            "Default",
            "mymap2"
        ]
    }
}
```

### 2) load/toggle current map

- route: `/map/load`
- method:`GET`
- query:
  - `mapName`: your map name ,e.g. `mymap`
- response:

```json
{
    "message":"success"
}
```

### 3. save map (in mapping mode)

- route: `/map/save`
- method: `POST`
- request body :

```json
{
    "mapName":"mymap"
}
```

- response:

```json
{
    "message":"success"
}
```

### 4. delete map

- route: `/map/delete`
- method: `POST`
- request body:

```json
{
    "mapName":"mymap"
}
```

- response body:

```json
{
    "message":"success"
}
```

## ROS launch

### 1) run preset launch file

- route: `/roslaunch/start`
- method: `GET`
- query:
  - `preset`: preset launch file, usage:`/roslaunch/start?preset=`, avaliable value:
    - `tr_hmi`: start basic nodes
    - `tr_hmi_with_cam`: start basic nodes and other nodes which used for usb camera.
- response:

```json
{
    "message":"success",
    "data":{
        "pid":1234 //pid for roslaunch subprocess.
    }
}
```

### 3) stop launch process

- route: `/roslaunch/stop`
- method: `GET`
- query:
  - `pid`: pid of the subprocess which excuting roslaunch by `/roslaunch/start`
- response:

```json
{
    "message":"success"
}
```