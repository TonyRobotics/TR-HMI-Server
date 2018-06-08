/**
 * Easy handle process.argv.
 * 
 * @author Dominic - hi@ydcool.me
 */

'use strict'

const PREFIX = '--';
const SUFFIX = '=';

/**
 * find argv for given key, for the argv formated as `--<arg>` or `--<arg>=`
 * @param arg key for args
 * @param cb callback for value of given args.
 */
let find = (arg, cb) => {
    if (!cb || typeof cb !== 'function') return;

    let argFound = false;

    process.argv.slice(2).forEach((v) => {
        if (v.startsWith(PREFIX + arg)) {
            v = v.replace(PREFIX + arg, '').replace(SUFFIX, '');
            argFound = true;
            cb(v == '' ? true : v);
            return;
        }
    });

    if (!argFound) cb(null);
}

module.exports.find = find;