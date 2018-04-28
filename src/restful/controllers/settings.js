const low = require('lowdb');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.join(__dirname, '../../data/db.json'));
const db = low(adapter)

/**
 * 获取默认地图
 */
let fn_getDefaultMap = async (ctx, next) => {
    let dm = db.get('settings.defaultMap').value();
    ctx.response.body = {
        message: 'success',
        data: {
            defaultMap: dm
        }
    }
}

/**
 * 设置默认地图名称
 */
let fn_setDefaultMap = async (ctx, next) => {
    let mapName = ctx.request.body.mapName;

    console.log('setting default map for name:', mapName);

    if (mapName) {
        db.set('settings.defaultMap', mapName).write();

        ctx.response.body = {
            message: 'success'
        };
    } else {
        ctx.response.body = {
            message: 'failed: bad request'
        };
    }
}

/**
 * 设置底盘最大运动速度
 */
let fn_setMaxSpeed = async (ctx, next) => {
    let maxVx = ctx.request.body.maxVx,
        maxVt = ctx.request.body.maxVt;
    db.set('settings.maxSpeed', {
        'maxVx': maxVx || '1',
        'maxVt': maxVt || '1'
    }).write();
    ctx.response.body = {
        message: 'success'
    }
}

/**
 * 获取最大速度
 */
let fn_getMaxSpeed = async (ctx, next) => {
    let maxSpeed = db.get('settings.maxSpeed').value();
    ctx.response.body = {
        message: 'success',
        data: maxSpeed
    }
}

module.exports = {
    'GET /settings/defaultMap': fn_getDefaultMap,
    'GET /settings/maxSpeed': fn_getMaxSpeed,
    'POST /settings/defaultMap': fn_setDefaultMap,
    'POST /settings/maxSpeed': fn_setMaxSpeed
};