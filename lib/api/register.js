/*
 * eq8-core
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, async) {
	return function register(args, done) {
		var api = this;
		var registries = _.keys(args);
		var emitRegisterEvent = _emitRegisterEvent.bind(
			null,
			api, args
		);
		var callback = done ? done : _.noop;

		async.each(registries, emitRegisterEvent, callback);
	};
};

function _emitRegisterEvent(api, args, registry, done) {
	var registerEvent = 'register:' + registry;

	api.emit(registerEvent, args[registry], done);
}
