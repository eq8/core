/*
 * eq8-core
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_) {
	return function listen(port, done) {
		var api = this;
		var http = require('http');
		var httpServer = http.createServer();
		var listeningEventHandler = _.bind(
			api.emit,
			api, 'listening', httpServer
		);
		var callback = done ? done : _.noop;

		httpServer.listen(port, listeningEventHandler);

		return callback(httpServer);
	};
};
