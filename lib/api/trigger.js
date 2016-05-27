/*
 * eq8-core
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_) {
	return function trigger(e, done) {
		var api = this;
		var callback = done ? done : _.noop;

		api.emit('trigger', e, callback);
	};
};
