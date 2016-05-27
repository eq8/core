/*
 * eq8-core
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_) {
	function appendPrior(api, listener, prior) {
		return function newChainedListener() {
			// arguments is NOT an array so we can't easily concat prior to args
			var args = Array.prototype.slice.call(arguments);
			var newArgs = _.concat(args, prior);

			listener.apply(api, newArgs);
		};
	}

	return function chainListener(e, listener, done) {
		var api = this;
		var prior = api.listeners[e];
		var newChainedListener = appendPrior(api, listener, prior);

		// remove previous listener and chain it to the new default listener
		if (_.isFunction(api.listeners[e])) {
			api.removeListener(e, api.listeners[e]);
		}

		api.listeners[e] = newChainedListener;
		api.on(e, newChainedListener);

		if (_.isFunction(done)) {
			done();
		}
	};
};
