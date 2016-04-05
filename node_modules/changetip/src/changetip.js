"use strict";
var https = require('https'),
    Q = require('q'),
    querystring = require('querystring'),
    Methods = {
        GET: "GET",
        POST: "POST"
    },
    ChangeTipException = require('./changetip-exception'),
    CHANGETIP_DEFAULT_VERSION = "1",
    CHANGETIP_DEFAULT_HOST = "api.changetip.com",
    instance;

/**
 * @typedef ChangeTipConfig
 * @type {object}
 * @property {string} api_key API Key for ChangeTip
 * @property {string} host Host URL for all remote API requests (defaults to CHANGETIP_DEFAULT_HOST)
 * @property {number} api_version Base URL for all remote API requests (defaults to CHANGETIP_DEFAULT_VERSION)
 */

/**
 * ChangeTip API
 * @param {ChangeTipConfig} [config]
 * @constructor
 */
var ChangeTip = function (config) {
    // If information was passed to constructor auto init
    if (config) {
        this.init(config);
    }
};

ChangeTip.prototype = {
    /**
     * API Key from ChangeTip. Request one from the {@link htps://www.changetip.com/api|ChangeTip API} website.'
     * @public
     * @property {string} api_key
     */
    set api_key(value) {
        this._api_key = value;
    },
    get api_key() {
        return this._api_key;
    },

    /**
     * Host used for all ChangeTip remote requests (api.changetip.com)
     * @public
     * @property {string} host
     */
    set host(value) {
        this._host = value;
    },

    get host() {
        return this._host || CHANGETIP_DEFAULT_HOST;
    },

    /**
     * API Version to use for all ChangeTip remote requests (v1)
     * @public
     * @property {number} api_version
     */
    set api_version(value) {
        this._api_version = value;
    },

    get api_version() {
        return this._api_version || CHANGETIP_DEFAULT_VERSION;
    },
    
    set dev_mode(value) {
        this._dev_mode = !!value;
    },
    
    get dev_mode() {
        return this._dev_mode || false
    },

    /**
     * Initializes the class for remote API Calls
     * @param {ChangeTipConfig} config
     * @returns {ChangeTip}
     */
    init: function (config) {
        config = config || {};
        this.api_key = config.api_key;
        this.host = config.host || undefined;
        this.api_version = config.api_version || undefined;
        this.dev_mode = config.dev_mode || false;
        return this;
    },

    /**
     * Sends a tip via the ChangeTip API
     * @param context_uid {number|string} Unique ID for this tip
     * @param {number|string} sender username/identifier for the tip sender
     * @param {number|string} receiver username/identifier for the tip receiever
     * @param {string} channel Origin channel for this tip (twitter, github, slack, etc)
     * @param {string} message Tip message. Includes amount or moniker.
     * @param [meta] {Object} optional object to be sent back in result set
     * @returns {promise.promise|jQuery.promise|promise|Q.promise|jQuery.ready.promise|l.promise}
     */
    send_tip: function (context_uid, sender, receiver, channel, message, meta) {
        if (!this.api_key) throw new ChangeTipException(300);
        if (!channel) throw new ChangeTipException(301);

        var deferred = Q.defer(),
            data;

        data = {
            context_uid: context_uid,
            sender: sender,
            receiver: receiver,
            channel: channel,
            message: message,
            meta: meta
        };

        this._send_request(data, 'tips', null, Methods.POST, deferred);
        return deferred.promise;
    },

    /**
     * Retrieve tips from the ChangeTip API
     * @param {string|string[]} tips Single or collection of tip identifiers to retrieve
     * @param {string} [channel] Channel to filter results. (github, twitter, slack, etc)
     * @returns {promise.promise|jQuery.promise|promise|Q.promise|jQuery.ready.promise|l.promise}
     */
    get_tip: function (tips, channel) {
        if (!this.api_key) throw new ChangeTipException(300);

        var deferred = Q.defer(),
            params;

        params = {
            tips: tips instanceof Array ? tips.join(",") : tips,
            channel: channel || ''
        };

        this._send_request({}, 'tips', params, Methods.GET, deferred);
        return deferred.promise;
    },

    /**
     * Sends a request
     * @param {Object} data JSON Object with data payload
     * @param {String} path API Path
     * @param {Object} params Query Parameters to be sent along with this request
     * @param {Methods} method HTTP Method
     * @param deferred Deferred Object
     * @param deferred.promise Deferred Promise Object
     * @param deferred.resolve Deferred success function
     * @param deferred.reject Deferred rejection function
     * @private
     */
    _send_request: function (data, path, params, method, deferred) {
        var options, query_params, req,
            dataString = JSON.stringify(data);

        query_params = querystring.stringify(params);

        options = {
            host: this.host,
            port: 443,
            path: '/v' + this.api_version + '/' + path + '/?api_key=' + this.api_key + (query_params ? ('&' + query_params) : ''),
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            }
        };

        if (!this.dev_mode) {
            req = https.request(options, function (res) {
                res.setEncoding('utf-8');

                var response = '', result;

                res.on('data', function (response_data) {
                    response += response_data;
                });

                res.on('end', function () {
                    result = JSON.parse(response);
                    deferred.resolve(result);
                });
            });

            req.write(dataString);
            req.end();
        } else {
            deferred.resolve({status:"dev_mode", data: data, params: params, path: options.path});
        }
    }
};

/**
 * Accessor for ChangeTip Singleton
 * @returns {ChangeTip}
 */
ChangeTip.get_instance = function () {
    if (!instance) {
        instance = new ChangeTip();
    }
    return instance;
};

/** ChangeTip Class */
module.exports = ChangeTip;