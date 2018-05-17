/**
 * startup automatic configuring
 */

'use strict'

const path = require('path');
const low = require('lowdb');
const os = require('os');
const fs = require('fs');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync(path.join(__dirname, 'db.json')));

/**
 * checkout the initial configs.
 */
let checkAndConfig = () => {
    //check and flag.
    let initialized = db.get('configs.initialized').value();
    if (!initialized) {
        console.log('[-] 检测到首次运行，开始进行配置……')
        forceResetConfigs();
    } else {
        console.log('[√] 检测到配置文件!');
    }
}

let forceResetConfigs = () => {
    console.log('[-] 开始应用默认配置……')
    let _mapsDir = path.join(os.homedir(), 'maps');
    if (!fs.existsSync(_mapsDir)) {
        fs.mkdirSync(_mapsDir);
    }
    db.defaults({
        configs: {
            initialized: true,
            mapsDir: _mapsDir
        },
        settings: {
            maxSpeed: {
                maxVx: 1,
                maxVt: 5
            }
        },
        maps: []
    }).write();

    prepareDefaultMap();

    console.log('[√] 服务配置完成！')
}

/**
 * 配置默认地图
 */
let prepareDefaultMap = () => {
    if (fs.existsSync(path.join(__dirname, 'default.pgm'))) {
        console.log('[-] 开始配置默认地图……');

        let destDir = path.join(os.homedir(), 'maps');
        fs.copyFileSync(path.join(__dirname, 'default.pgm'), path.join(destDir, 'default.pgm'));
        fs.copyFileSync(path.join(__dirname, 'default.yaml'), path.join(destDir, 'default.yaml'));

        db.get('maps')
            .push({
                'alias': 'Default',
                'fileName': 'default'
            })
            .write();

        console.log('[√] 默认地图配置完成！');
    } else {
        console.error('[x] 找不到默认地图文件，跳过配置！');
    }
}

module.exports.checkAndConfig = checkAndConfig;
module.exports.forceResetConfigs = forceResetConfigs;