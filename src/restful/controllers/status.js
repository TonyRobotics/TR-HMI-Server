'use strict'

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

module.exports = {
    'GET /status/systemInfo': fn_systemInfo,
    'GET /status/ros': fn_rosStatus,
}