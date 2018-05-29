/**
 * LowDB in singleton pattern, prevent from some bugs.
 * 
 * @author Dominic
 */

'use strict'

const low = require('lowdb');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.join(__dirname, '../data/db.json'));
const db = low(adapter);

let fn_getDB = () => {
    return db;
}

module.exports.getDB = fn_getDB;