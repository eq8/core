/*
 * eq8-core
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

// externals
var _ = require('lodash');
var async = require('async');
var util = require('util');
var winston = require('winston');

var EventEmitter = require('events');
var Logger = winston.Logger;

function Api(options) {
	var api = this;
	EventEmitter.call(api);

	options = _.defaultsDeep(options, {
		logger: {
			levels: {
				trace: 5,
				debug: 4,
				info: 3,
				warn: 2,
				error: 1,
				fatal: 0
			},
			colors: {
				trace: 'grey',
				debug: 'blue',
				info: 'green',
				warn: 'yellow',
				error: 'red',
				fatal: 'magenta'
			},
			transports: [
				new (winston.transports.Console)({
					level: process.env.LOG_LEVEL || 'info',
					colorize: true
				})
			]
		},
		on: {
			subscribe: [],
			dispatch: [],
			initialized: []
		}
	});

	// INITIALIZATION
	var logger = new Logger(options.logger);

	_.assign(api, {
		listeners: {},
		logger: logger
	});

	var resumeInit = _.partial(_resumeInit, api, options);

	api.addRegistrar(options.registrars || {}, resumeInit);
}
util.inherits(Api, EventEmitter);

function _resumeInit(api, options, error) {
	if (error) {
		return api.logger.error(error);
	}

	api.chainListener('error', api.logger.error);
	api.chainListener('initialized', initialized);

	// CUSTOM LISTENERS
	var addDispatchHooks = _.bind(api.chainListener, api, 'dispatch');
	_.each(options.on.dispatch, addDispatchHooks);

	var addSubscribeHooks = _.bind(api.chainListener, api, 'subscribe');
	_.each(options.on.subscribe, addSubscribeHooks);

	var addInitHooks = _.bind(api.chainListener, api, 'initialized');
	_.each(options.on.initialized, addInitHooks);

	// GENERATE EVENTS
	return api.emit('initialized', api);
}

function initialized(api) {
	api.logger.debug('initialized');
}

// API

Api.prototype.chainListener = require('./api/chain-listener')(_);

Api.prototype.addRegistrar = require('./api/add-registrar')(_, async);

Api.prototype.register = require('./api/register')(_, async);

Api.prototype.dispatch = require('./api/dispatch')();

Api.prototype.subscribe = require('./api/subscribe')(_);

module.exports = Api;
