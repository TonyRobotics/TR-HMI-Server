/**
 * 系统使用状态统计
 */
let fn_systemInfo = async (ctx, next) => {
    ctx.response.body = {
        message: 'success',
        data: await require('../../utils/sysmonitor')()
    };
}

module.exports = {
    'GET /status/systemInfo': fn_systemInfo,
}