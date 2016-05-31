/*
 * eq8-core
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, async) {
	return function addRegistrar(registrars, done) {
		var api = this;
		var registries = _.keys(registrars);
		var addRegisterListener = _addRegisterListener.bind(
			null,
			api, registrars
		);
		var callback = done ? done : _.noop;

		async.eachSeries(registries, addRegisterListener, callback);
	};
};

function _addRegisterListener(api, registrars, registry, done) {
	var registerEvent = 'register:' + registry;

	api.chainListener(registerEvent, registrars[registry], done);
}
