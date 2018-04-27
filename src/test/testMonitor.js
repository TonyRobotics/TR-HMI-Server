const monitor = require('../utils/sysmonitor');

monitor.startMonitor((data) => {
    console.log('MONITOR:', data);
});

setTimeout(() => {
    monitor.stopMonitor();
}, 3000);

console.log('monitor started.');