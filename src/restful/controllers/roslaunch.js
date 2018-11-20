/**
 * run roslaunch api
 */

'use strict'

const rosCtrl = require('../../roscontrol');
const path = require('path');

let fn_startROSLaunch = async (ctx, next) => {



    let preset = ctx.request.query.preset;
    console.log("运行ROS Launch",preset);
    if (!preset) {
        ctx.response.body = {
            message: 'failed: need preset in query!'
        }
    } else {

        console.log("运行ROS Launch 1");

        let launchFile;
        //TODO: 在此处更新预设 launch 
        switch (preset) {
            case 'tr_hmi':
                launchFile = path.join(__dirname, '../../launch/tr_hmi.launch');
                break;
            case 'tr_hmi_with_cam':
                launchFile = path.join(__dirname, '../../launch/tr_hmi_with_cam.launch');
                break;
            default:
                ctx.response.body = {
                    message: `failed: requested preset ${preset} not supported!`
                }
                next();
                break;
        }
        let pid = rosCtrl.runRosLaunch(null, launchFile, (event, data) => {
            if (event == 'close') {
                console.log('roslaunch Closed ===> \n', data);
            }
            if (event == 'stderr') {
                console.error('roslaunch STDERR ===>\n', data);
            }
            if (event == 'stdout') {
                console.log('roslaunch stdout ===>\n', data);
            }
        });
        ctx.response.body = {
            message: 'success',
            data: {
                pid: pid
            }
        };
    }
}

let fn_stopROSLaunch = async (ctx, next) => {
    let pid = ctx.request.query.pid;
    if (!pid) {
        ctx.response.body = {
            message: 'failed: need pid in query!'
        }
    } else {
        try {
            await rosCtrl.stopRosLaunch(pid);
            ctx.response.body = {
                message: 'success'
            }
        } catch (e) {
            ctx.response.body = {
                message: `failed: ${e}`
            };
        }
    }
}

module.exports = {
    'GET /roslaunch/start': fn_startROSLaunch,
    'GET /roslaunch/stop': fn_stopROSLaunch
}