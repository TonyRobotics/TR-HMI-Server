/**
 * catching /rosout messages
 * @author Dominic
 */

'use strict'

const cp = require('child_process');
let subProcess;

let startLogging = callback => {
    try {
        stopLogging();
        subProcess = cp.spawn('rostopic', ['echo', '/rosout']);
        subProcess.stdout.on('data', (data) => {
            callback(data.toString(), null);
        });
        subProcess.stderr.on('data', (data) => {
            callback(null, data.toString());
        });
    } catch (e) {
        callback(null, e)
    }
}

let stopLogging = () => {
    if (subProcess) {
        subProcess.kill('SIGHUP');
        subProcess = null;
    }
}

module.exports.startLogging = startLogging
module.exports.stopLogging = stopLogging