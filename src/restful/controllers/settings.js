const low = require('lowdb');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.join(__dirname, '../../data/db.json'));
const db = low(adapter)

let fn_getDefaultMap = async (ctx, next) => {
    let dm = db.get('settings.defaultMap').value();
    console.log('get map:', dm)
    ctx.response.body = {
        message: 'success',
        data: {
            defaultMap: dm
        }
    }
}

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

module.exports = {
    'GET /settings/defaultMap': fn_getDefaultMap,
    'POST /settings/defaultMap': fn_setDefaultMap
};