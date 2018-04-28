// const monitor = require('../utils/sysmonitor');

// monitor.startMonitor((data) => {
//     console.log('MONITOR:', data);
// });

// setTimeout(() => {
//     monitor.stopMonitor();
// }, 3000);

// console.log('monitor started.');

// console.log('ros status:')
// require('../utils/rosStatus')().then((data) => {
//     console.log(JSON.stringify(data));
// });

console.log('start logging:')
const log = require('../utils/rosout');

log.startLogging((data) => {
    console.log('------------')
    console.log(data);
})

setTimeout(() => {
    log.stopLogging();
}, 5000);