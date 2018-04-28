/**
 * map api
 */

'use strict'

const fs = require('fs');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync(path.join(__dirname, '../../data/db.json')));
const rosCtrl = require('../../roscontrol');

let fn_listMap = async (ctx, next) => {
    let mapDir = db.get('configs.mapsDir').value();
    try {
        let maps = fs.readdirSync(mapDir).map((v) => {
            let s = v.split('.');
            return s[s.length - 1] == 'yaml';
        });
        ctx.response.body = {
            message: 'success',
            data: {
                'maps': maps
            }
        }
    } catch (e) {
        ctx.response.body = {
            message: `failed:${e}`
        }
    }
}

let fn_loadMap = async (ctx, next) => {
    let mapName = ctx.request.query.mapName;
    if (mapName) {
        rosCtrl.reloadMap(mapName);
        ctx.response.body = {
            message: 'success'
        }
    } else {
        ctx.response.body = {
            message: "failed: need mapName in query!"
        }
    }
}

module.exports = {
    'GET /map/list': fn_listMap,
    'GET /map/load': fn_loadMap
}