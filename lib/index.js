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
			search: [],
			trigger: [],
			listening: [],
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
	var addTriggerHooks = _.bind(api.chainListener, api, 'trigger');
	_.each(options.on.trigger, addTriggerHooks);

	var addSearchHooks = _.bind(api.chainListener, api, 'search');
	_.each(options.on.search, addSearchHooks);

	var addInitHooks = _.bind(api.chainListener, api, 'initialized');
	_.each(options.on.initialized, addInitHooks);

	// GENERATE EVENTS
	return api.emit('initialized', api);
}

function initialized(api) {
	api.logger.info('initialized');
}

// API

Api.prototype.chainListener = require('./api/chain-listener')(_);

Api.prototype.addRegistrar = require('./api/add-registrar')(_, async);

Api.prototype.register = require('./api/register')(_, async);

Api.prototype.trigger = require('./api/trigger')();

Api.prototype.search = require('./api/search')(_);

Api.prototype.listen = require('./api/listen')(_);

module.exports = Api;
