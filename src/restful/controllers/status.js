'use strict'

const db = require('../../utils/singletonDB').getDB();

/**
 * 系统使用状态统计
 */
let fn_systemInfo = async (ctx, next) => {
    try {
        ctx.response.body = {
            message: 'success',
            data: await require('../../utils/sysmonitor')()
        };
    } catch (e) {
        ctx.response.body = {
            message: `failed:${e}`
        }
    }
}

/**
 * 
 */
let fn_rosStatus = async (ctx, next) => {
    try {
        ctx.response.body = {
            message: 'success',
            data: await require('../../utils/rosStatus')()
        }
    } catch (e) {
        console.error('failed to get ros status:', e);
        ctx.response.body = {
            message: `failed:${e}`
        }
    }
}

/**
 * 
 */
let fn_robotInfo = async (ctx, next) => {
    try {
        let product = db.get('product').value();
        let productInfo = db.get('productions').find({
            name: product
        }).value();

        ctx.response.body = {
            message: 'success',
            data: {
                product: product,
                productInfo: productInfo
            }
        }
    } catch (e) {
        console.error('failed to get robot info:', e);
        ctx.response.body = {
            message: `failed:${e}`
        }
    }
}

module.exports = {
    'GET /status/systemInfo': fn_systemInfo,
    'GET /status/ros': fn_rosStatus,
    'GET /status/robot': fn_robotInfo,
}