/**
 * A simple system monitor
 * @author Dominic
 */

'use strict'

const osUtils = require('./lib/osutils');

/**
 * monitor with system usage statistics.
 */
module.exports = () => new Promise(async (resolve, reject) => {
    try {
        let diskInfo = await osUtils.harddrive();
        let cpuUsage = await osUtils.cpuUsage();
        resolve({
            mem: {
                total: `${osUtils.totalmem().toFixed(2)}MB`,
                free: `${osUtils.freemem().toFixed(2)}MB`,
                freeMemPercentage: `${(osUtils.freememPercentage() * 100).toFixed(2)}%`
            },
            cpu: {
                count: osUtils.cpuCount(),
                usage: `${(cpuUsage * 100).toFixed(2)}%`
            },
            disk: diskInfo,
            system: {
                uptime: (osUtils.sysUptime() / 60).toFixed(0),
                loadavg: osUtils.loadavg()
            }
        });
    } catch (e) {
        reject(e);
    }
})