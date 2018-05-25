/**
 * Simple Spawn.
 */

'use strict'

const {
    spawn
} = require('child_process');

let allProcesses = [];

/**
 * a simple spawn
 * @param command command
 * @param args args array
 * @param callback error callback
 * @return pid of subprocess
 */
function simpleSpawn(command, args, callback) {
    if (!command) {
        console.error('command should not be empty!');
        return;
    }
    let sp = spawn(command, args || '');
    sp.stdout.on('data', (data) => {
        console.log(`stdout from: ${command} ${args}\n --DATA: ${data}`);
    });
    sp.stderr.on('data', (data) => {
        console.log(`stderr from: ${command} ${args}\n --DATA: ${data}`);
        
        if (data && callback) {
            callback(data);
        }
    });

    sp.on('close', (code, signal) => {
        console.log(`sp end from: ${command} ${args}\n --CODE:${code || ''} SIGNAL:${signal}`);
    });

    sp.on('error', (err) => {
        console.log(`sp error from: ${command} ${args}\n --ERROR:${err}`);
    })

    allProcesses.push({
        pid: sp.pid,
        cp: sp
    });

    return sp.pid;
}

/**
 * kill subprocess 
 */
function killSpawn(pid) {
    allProcesses.forEach((v, i) => {
        if (pid == v.pid && v.cp) {
            v.cp.kill('SIGHUP');
            allProcesses.splice(i, 1);
            console.log('killed process:', pid);
        }
    });
}

module.exports.simpleSpawn = simpleSpawn;
module.exports.killSpawn = killSpawn;