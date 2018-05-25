# TR HMI 底盘服务端部署文档

## 环境准备

1. `NodeJS　^v8.0.0` ： 安装参考官方手册.
2. `cnpm ^v5.6.0` : 国内 NodeJS 仓库镜像源，可加快访问速度，使用参考 [cnpm](https://npm.taobao.org).

## 代码部署

1. 从官方　Git 仓克隆到底盘: `git clone git@github.com:TonyRobotics/TR-HMI-Server.git`;
2. 进入工程目录，执行 `cnpm install` 安装所需依赖模块;
3. 执行　`node start src/index.js` 启动服务,　建议使用 [PM2](https://github.com/Unitech/pm2) 管理服务;

## 默认配置

默认配置项由　`src/data/config.js`　设置管理;

1. 默认地图存放位置：　`~/maps/`;
2. 自带一张默认地图, 首次启动项目时会自动配置到默认地图存储路径下：　`src/data/default.yaml<pgm>` --> `~/maps/default.yaml<pgm>`;
3. 默认　launch 文件：　`src/launch/tr_hmi.launch`, 用于启动必要的　ros node 和　服务;