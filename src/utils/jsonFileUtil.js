/**
 * Easy JSON Reader and Writter.
 * 
 * @author Dominic - hi@ydcool.me
 */

'use strict'

const fs = require('fs');

/**
 * read the given file with fullpath and parse to plain object.
 * @param file - json file with fullpath
 * @return plain object that parsed of json file
 */
let read = (file) => {
    return new Promise((resolve, reject) => {
        try {
            if (fs.existsSync(file)) {
                resolve(JSON.parse(fs.readFileSync(file)));
            } else {
                reject(`file does not exists:${file}`)
            }
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * write given plain object to specified json file.
 * 
 * @param file the fullpath with filename which file will written in.
 * @param data plain object to written.
 */
let write = (file, data) => {
    return new Promise((resolve, reject) => {
        try {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
            fs.writeFileSync(file, JSON.stringify(data));
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.read = read;
module.exports.write = write;