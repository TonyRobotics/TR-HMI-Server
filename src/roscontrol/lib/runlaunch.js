/**
 * excute `roslaunch` command.
 */

'use strict'

const cp = require('child_process');

/**
 * excute `roslaunch [options] [package] <filename> [arg_name:=value...]`
 * @param packageName ros package name
 * @param fileName ros launch file name 
 * @param callback terminal output callback, `fn(<eventType>,<data>)`; 
 * eventType includes `stdout`,`stderr`,`close`
 * @param options `roslaunch` options
 * @param args `roslaunch` args, `[arg_name:=value...]`
 * @returns pid , pid of subprocess 
 */
function runRosLaunch(packageName, fileName, callback, options, args) {
    let argsArr = [];
    if (options) {
        argsArr.push(options);
    }
    if (packageName) {
        argsArr.push(packageName);
    }
    if (fileName) {
        argsArr.push(fileName);
    }
    if (args) {
        argsArr.push(...args)
    }
    let subprocess = cp.spawn('roslaunch', argsArr);
    subprocess.on('close', (data) => {
        if (callback) {
            callback('close', data.toString());
        }
    })
    subprocess.stderr.on('data', (data) => {
        if (callback) {
            callback('stderr', data.toString());
        }
    })
    subprocess.stdout.on('data', (data) => {
        if (callback) {
            callback('stdout', data.toString());
        }
    });
    return subprocess.pid;
}

function stopRosLaunch(pid) {
    return new Promise((resolve, reject) => {
        cp.exec(`kill ${pid}`, (err, stdout, stderr) => {
            if (stderr) {
                reject(stderr);
            } else {
                resolve();
            }
        });
    });
}

module.exports.runRosLaunch = runRosLaunch;
module.exports.stopRosLaunch = stopRosLaunch;