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
    let maps = db.get('maps').values().map((v) => {
        return v.alias;
    });
    ctx.response.body = {
        message: 'success',
        data: {
            'maps': maps
        }
    }
}

let fn_loadMap = async (ctx, next) => {
    let mapName = ctx.request.query.mapName;
    if (mapName) {
        let mapDir = db.get('configs.mapsDir').value();
        let map = db.get('maps').find({
            alias: mapName
        }).value();
        if (map && map.fileName) {
            rosCtrl.reloadMap(path.join(mapDir, map.fileName));
            ctx.response.body = {
                message: 'success'
            }
        } else {
            ctx.response.body = {
                message: 'failed:no map found for name:' + mapName
            }
        }
    } else {
        ctx.response.body = {
            message: "failed: need mapName in query!"
        }
    }
}

let fn_saveMap = async (ctx, next) => {
    let alias = ctx.request.body.mapName;
    if (alias) {
        let m = db.get('maps').find({
            'alias': alias
        }).value();
        if (m) {
            ctx.response.body = {
                message: '地图名称已存在!'
            }
        } else {
            let mapDir = db.get('configs.mapsDir').value();
            let fileName = `map_${new Date().getTime()}`;
            db.get('maps')
                .push({
                    'alias': alias,
                    'fileName': fileName
                })
                .write();
            rosCtrl.saveMap(path.join(mapDir, fileName));
            ctx.response.body = {
                message: 'success'
            }
        }
    } else {
        ctx.response.body = {
            message: "failed: need mapName in request body!"
        }
    }
}

let fn_deleteMap = async (ctx, next) => {
    let alias = ctx.request.body.mapName;
    if (alias) {
        let m = db.get('maps').find({
            'alias': alias
        }).value();
        if (m && m.fileName) {
            let mapDir = db.get('configs.mapsDir').value();
            fs.unlinkSync(path.join(mapDir, m.fileName + '.pgm'));
            fs.unlinkSync(path.join(mapDir, m.fileName + '.yaml'));
            db.get('maps').remove({
                'alias': alias
            }).write();
            ctx.response.body = {
                message: 'success'
            }
        } else {
            ctx.response.body = {
                message: 'failed: map not found for name:' + alias
            }
        }
    } else {
        ctx.response.body = {
            message: 'failed: map not found for name:' + alias
        }
    }
}

module.exports = {
    'GET /map/list': fn_listMap,
    'GET /map/load': fn_loadMap,
    'POST /map/save': fn_saveMap,
    'POST /map/delete': fn_deleteMap
}