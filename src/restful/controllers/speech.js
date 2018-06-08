/**
 * TR-小白机器人 遥控语音朗读模块 API
 */

'use strict'

const shortId = require('shortid');
const SCHEMA = 'speechTexts';

let db = require('../../utils/singletonDB').getDB();

let fn_getSpeechTextList = async (ctx, next) => {
    let list = db.get(SCHEMA).values();
    ctx.response.body = {
        message: 'success',
        data: list
    }
}

let fn_getSpeechTextForId = async (ctx, next) => {
    let id = ctx.request.query.id;
    if (id) {
        let t = db.get(SCHEMA)
            .find({
                id: id
            })
            .value();
        ctx.response.body = {
            message: 'success',
            data: t
        }
    } else {
        ctx.response.body = {
            message: 'error: no id in query'
        }
    }
}

let fn_insertSpeechText = async (ctx, next) => {
    let text = ctx.request.body.text;
    if (text) {
        let sid = shortId.generate();
        db.get(SCHEMA)
            .push({
                'id': sid,
                'text': text
            })
            .write();

        ctx.response.body = {
            message: 'success',
            data: {
                id: sid
            }
        }
    } else {
        ctx.response.body = {
            message: 'error: no text in request body'
        }
    }
}

let fn_deleteSpeechTextForId = async (ctx, next) => {
    let id = ctx.request.body.id;
    if (id) {
        db.get(SCHEMA).remove({
            id: id
        }).write();
        ctx.response.body = {
            message: 'success'
        }
    } else {
        ctx.response.body = {
            message: 'failed: need id in query'
        }
    }
}

module.exports = {
    'GET /speech/list': fn_getSpeechTextList,
    'GET /speech/get': fn_getSpeechTextForId,
    'POST /speech/set': fn_insertSpeechText,
    'POST /speech/delete': fn_deleteSpeechTextForId
}