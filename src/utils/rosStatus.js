/**
 * ros nodes and services statistcs
 * @author Dominic
 */

'use strict'

const cp = require('child_process');

/**
 * list all ros nodes
 */
let listRosNodes = () => new Promise((resolve, reject) => {
    cp.exec('rosnode list', (err, stdout, stderr) => {
        if (err) {
            reject(err);
            return;
        }
        let nodes = stdout.split('\n');
        //delete last empty break
        nodes.splice(nodes.length - 1, 1);
        resolve(nodes);
    })
});

/**
 * list all ros services
 */
let listRosService = () => new Promise((resolve, reject) => {
    cp.exec('rosservice list', (err, stdout, stderr) => {
        if (err) {
            reject(err);
            return;
        }
        let services = stdout.split('\n');
        //delete last empty break
        services.splice(services.length - 1, 1);
        resolve(services);
    })
});

module.exports = () => new Promise(async (resolve, reject) => {
    try {
        resolve({
            rosNodes: await listRosNodes(),
            rosServices: await listRosService()
        });
    } catch (e) {
        reject(e);
    }
});