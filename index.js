/*
 * eq8-core
 * Copyright(c) 2017 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

const winston = require('winston');
const ee = require('event-emitter');

function Api(options) {
	const { logger } = options || {};

	if (logger) {
		this.logger = logger;
	}
}

Api.prototype.logger = winston;

Api.prototype.dispatch = function dispatch(e, done) {
	const api = this;

	api.emit('dispatch', e, done);
};

Api.prototype.subscribe = function subscribe(q, done) {
	const api = this;

	api.emit('subscribe', q, done);
};

ee(Api.prototype);

module.exports = options => new Api(options);
