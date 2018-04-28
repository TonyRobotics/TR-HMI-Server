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
                total: osUtils.totalmem(),
                free: osUtils.freemem(),
                freeMemPercentage: osUtils.freememPercentage()
            },
            cpu: {
                count: osUtils.cpuCount(),
                usage: cpuUsage
            },
            disk: diskInfo,
            system: {
                uptime: osUtils.sysUptime(),
                loadavg: osUtils.loadavg()
            }
        });
    } catch (e) {
        reject(e);
    }
})