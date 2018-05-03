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
        forceResetConfigs();
    }
}

let forceResetConfigs = () => {
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
}

module.exports.checkAndConfig = checkAndConfig;
module.exports.forceResetConfigs = forceResetConfigs;