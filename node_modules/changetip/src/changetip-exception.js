"use strict";
var util = require('util');

/**
 * Error Exception Lookup
 * @enum {string}
 * @memberOf ChangeTipException
 */
var ChangeTipExceptions = {
    /** API Key was not set. This must be set during construction or by running init */
    300: "No API_KEY set. Call init prior to any remote API calls",
    /** Channel was not defined for remote call */
    301: "Channel is undefined, must be set prior to any remote API calls"
};

/**
 * Change Tip Exception
 * @param {number} code Error code for this exception
 * @constructor
 */
var ChangeTipException = function(code) {
    this.name = "ChangeTipException";
    this.code = code;
    ChangeTipException.super_.call(this, ChangeTipExceptions[code]);
};

util.inherits(ChangeTipException, Error);

/** ChangeTipException Class */
module.exports = ChangeTipException;