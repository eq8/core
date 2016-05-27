/*
 * eq8-core
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported() {
	return function search(q, done) {
		var api = this;

		api.emit('search', q, done);
	};
};
