/**
 * startup automatic configuring
 */

'use strict'

const path = require('path');
const os = require('os');
const fs = require('fs');
const jsonUtil = require('../utils/jsonFileUtil');
const argvHandler = require('../utils/argvHandler');

let db = require('../utils/singletonDB').getDB();

/**
 * checkout the initial configs.
 */
let checkAndConfig = () => {
    //check and flag.
    argvHandler.find('reset', (v) => {
        if (v) {
            forceResetConfigs();
        } else {
            let initialized = db.get('configs.initialized').value();
            if (!initialized) {
                console.log('[-] Start configuration for the first launch……')
                forceResetConfigs();
            } else {
                console.log('[√] already configred !');
            }
        }
    });

    configProducts();
}

let forceResetConfigs = () => {
    console.log('[-] start applying default configuration……')

    //check and create default map dir
    let _mapsDir = path.join(os.homedir(), 'maps');
    if (!fs.existsSync(_mapsDir)) {
        fs.mkdirSync(_mapsDir);
    }
    //configure default database schema and data.
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
        maps: [],
        speechTexts: [],
        product: 'abel05',
    }).write();

    prepareDefaultMap();

    loadProductionsData();

    console.log('[√] reset configration complete!');
}

/**
 * move the default map file into the default map folder if not exist.
 */
let prepareDefaultMap = () => {
    let maps = db.get('maps').value();
    if (maps && maps.length > 0) {
        console.log('[√] map file exists, step over...');
    } else if (fs.existsSync(path.join(__dirname, 'default.pgm'))) {
        console.log('[-] start applying default map file...');

        let destDir = path.join(os.homedir(), 'maps');
        fs.copyFileSync(path.join(__dirname, 'default.pgm'), path.join(destDir, 'default.pgm'));
        fs.copyFileSync(path.join(__dirname, 'default.yaml'), path.join(destDir, 'default.yaml'));

        db.get('maps')
            .push({
                'alias': 'Default',
                'fileName': 'default'
            })
            .write();

        console.log('[√] default map is ready.');
    } else {
        console.error('[x] missing the default map file, exit.');
    }
}


/**
 * load the configration for the specified production of robot.
 */
let configProducts = async () => {
    argvHandler.find('product', (v) => {
        if (v) {
            db.set('product', v).write();
            console.log(`[√] apply configuration for prodution ${v}`);
        } else {
            console.log(`[!] No production args specified! we\'ll use "${db.get('product').value()}" as default! ` +
                'To specify your product, please apply "production=<your product>" into running args.');
        }
    });
}

/**
 * load productions configuration into database.
 */
let loadProductionsData = async () => {
    let productionsFile = path.join(__dirname, 'productions.json');
    let productions = await jsonUtil.read(productionsFile);
    if (productions) {
        db.set('productions', productions).write();
        console.log('[√] finish load productions info into database.')
    } else {
        console.log('[x] missing productions data! ');
    }
}

module.exports.checkAndConfig = checkAndConfig;
module.exports.forceResetConfigs = forceResetConfigs;