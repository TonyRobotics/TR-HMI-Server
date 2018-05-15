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
    console.log('[√] 服务配置完成……')
}



module.exports.checkAndConfig = checkAndConfig;
module.exports.forceResetConfigs = forceResetConfigs;