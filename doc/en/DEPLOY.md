# TR HMI Deploy Manual

## Environment

1. `NodeJS　^v8.0.0` ：Get help from [official manual](https://nodejs.org/en/);
2. ~~`cnpm ^v5.6.0` : npm mirror site in China, see [cnpm](https://npm.taobao.org).~~


## Required ROS package

1. `ros-kinetic-slam-gmapping`
2. `ros-kinetic-tf2-web-republisher`
3. `ros-kinetic-map-server`
4. `ros-kinetic-web-video-server`
5. `ros-kinetic-usb-cam`

## Install

1. clone from official repo: `git clone git@github.com:TonyRobotics/TR-HMI-Server.git`;
2. go to project folder and run `cnpm install`;
3. run　`node start src/index.js`; Use [PM2](https://github.com/Unitech/pm2) to manage node services is strongly recommanded;

## Default configuration

All the configurations mananged by `src/data/config.js`;

1. Default folder for ROS maps ：　`~/maps/`;
2. One packaged map file, will copied to the default maps folder automatically when first run：　`src/data/default.yaml<pgm>` --> `~/maps/default.yaml<pgm>`;
3. Default　launch file：　`src/launch/tr_hmi.launch`, used for starting some essential ros nodes and services.

## Run

`node src/index.js --product=abel05`

Or

`pm2 start src/index.js -x -- --product=abel05`

Products information is defined in `src/data/productions.json`.

If you want to change the product that has set before, you should also pass the `--reset` argument to node to reset the configuration file.