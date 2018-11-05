# TR HMI 底盘服务端部署文档

## 环境准备

1. `NodeJS` ： 安装参考官方手册. 版本建议 `8.x` 以上；
2. `cnpm` : 国内 NodeJS 仓库镜像源，可加快访问速度，使用参考 [cnpm](https://npm.taobao.org). 安装方式：`sudo npm install -g cnpm --registry=https://registry.npm.taobao.org`

## 必要的 ros 包

1. 导航路径规划：`ros-kinetic-slam-gmapping`
2. Web TF 变换：`ros-kinetic-tf2-web-republisher`
3. 地图服务：`ros-kinetic-map-server`
4. 摄像头流服务：`ros-kinetic-web-video-server`
5. USB 摄像头驱动：`ros-kinetic-usb-cam`

## 代码部署

1. 创建或进入代码存放路径：`cd ~/tr_hmi` 或 `mkdir ~/tr_hmi && cd ~/tr_hmi`;
2. 从官方　Git 仓克隆到底盘: `git clone git@github.com:TonyRobotics/TR-HMI-Server.git`;
3. 进入工程目录，`cd ~/tr_hmi/TR-HMI-Server`,
4. 安装依赖包：`cnpm install`;
5. 直接启动服务：`node src/index.js`,　强烈建议使用 [PM2](https://github.com/Unitech/pm2) 管理服务；
6. \*(可选)：如果使用 `pm2` 管理服务，以下是简明使用教程：
   1. 安装 pm2: `sudo cnpm install -g pm2`；
   2. 设置开机启动：`pm2 startup`, 执行此命令后，会打印出一行命令，复制并执行 命令即可；
   3. 进入 HMI 服务所在文件夹：`cd ~/tr_hmi/TR-HMI-Server`；
   4. 启动 HMI 服务：`pm2 start src/index.js -- --product=abel05`,根据当产品指定相应型号参数，详细见下方启动参数说明；
   5. 保存 HMI 服务：若上一步顺利启动服务，可执行 `pm2 save` 保存当前服务配置，以使 HMI 服务开机自动启动；
   6. 若系统环境变量有所更新，为避免出现异常 bug，请移除当前 pm2 的服务配置：`pm2 delete all`，然后重启 HMI 服务并保存（重复 4,5)；

## 启动参数

启动参数是启动 HMI 服务时指定的运行参数，示例：

`node src/index.js --product=abel05`

或者

`pm2 start src/index.js -x -- --product=abel05`
> 如果运行不成功，请查看底盘代码，src/data/db.json 中 productions.name与 命令参数中的 --product=abel05 名称是否一致，注意大小写

### 一、指定产品型号

* 参数：`--product=<name>`
* 说明: 启动时指定当前服务所在底盘的产品型号，默认缺省型号为 `abel05`,所有可用产品型号配置在 `src/data/productions.json`, 如需更改或新增产品配置，比如更新某个 launch 文件名称等，请直接修改此文件。修改之后需重启服务并添加 `--reset` 参数以使之生效；
* 取值：目前支持的产品有： `abel05`,`abel10`,`xiaobai`,`trtank`，`venus05`,`venus05cam`.

### 二、重置所有配置

* 参数：`--reset`
* 说明：启动时重置所有配置，包括产品型号，地图默认存放路径，等等。


## 产品参数配置详解

产品参数配置都写在了 [src/data/productions.json](../../src/data/productions.json) 里面，如果需要更新产品型号相关的配置信息，请手动更改这个配置文件，按照下表参数以及格式进行配置。

|参数|类型|默认值|说明|
|-|-|-|-|
|`name`|string|`abel05`|产品型号名字，是用于在命令行启动里识别的：`--product=abel05`|
|`productName`|string|`ABEL 05`|产品名称，用于手机端展示|
|`package`|string|`abel05_navigation`|ros package 名称，对应底盘上的需要运行 ros 程序的包名|
|`cameraEnabled`|boolean|`false`|是否配置了摄像头，默认否，如果底盘有配置摄像头，请改为 true, 底盘会自动启用摄像头对应的 launch 文件和视频流服务，同时移动端会自动根据此配置加载摄像头组件|
|`launchFiles`|object|↓|三种运行模式对应的launch文件名称,根据底盘运行的ros包和代码进行配置|
|↑|`control`|`controller.launch`|控制模式对应的 launch文件|
|↑|`mapping`|`mapping.launch`|建图模式对应的 launch文件|
|↑|`navigation`|`navigation.launch`|导航模式对应的 launch文件|


## 默认配置说明

默认配置项由　`src/data/config.js`　设置管理;

1. 默认地图存放位置：　`~/maps/`;
2. 自带一张默认地图, 首次启动项目时会自动配置到默认地图存储路径下：　`src/data/default.yaml<pgm>` --> `~/maps/default.yaml<pgm>`;
3. 默认　launch 文件：　`src/launch/tr_hmi.launch`, 用于启动必要的　ros node 和　服务;

## 代码更新

> 更新底盘服务代码直接从 git 仓库拉取最新即可，需要底盘连接网络。

```shell
cd tr_hmi/TR_HMI_Server

git pull

pm2 reload all
```