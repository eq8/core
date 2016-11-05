'use strict';

var test = require('tape');
var proxyquire = require('proxyquire');
var Core = require('../index.js');

// add-registrar.js  chain-listener.js  listen.js	register.js  subscribe.js	dispatch.js

test('test lib/index', function(t) {
	t.plan(1);
	t.ok(true, 'placeholder');
});

test('Core#dispatch', function(t) {
	var core = new Core();
	var fixtureAction = 'someArbitraryAction';

	t.plan(1);
	core.on('dispatch', function(e) {
		t.equal(e, fixtureAction);
	});

	core.dispatch(fixtureAction);
});

test('Core#subscribe', function(t) {
	var core = new Core();
	var fixtureQuery = 'someArbitraryQuery';
	var fixtureError = 'someArbitraryError';
	var fixtureResult = 'someArbitraryResult';

	t.plan(3);
	core.on('subscribe', function(q, done) {
		t.equal(q, fixtureQuery);
		done(fixtureError, fixtureResult);
	});

	core.subscribe(fixtureQuery, function(err, result) {
		t.equal(err, fixtureError);
		t.equal(result, fixtureResult);
	});
});

test('Core#addRegistrar, Core#register', function(t) {
	var core = new Core();
	var fixtureOptions = 'someArbitraryRegistryOption';

	t.plan(1);

	core.addRegistrar({
		registry: function(options) {
			t.equal(options, fixtureOptions);
		}
	});

	core.register({
		registry: fixtureOptions
	});
});

test('Core#chainListener', function(t) {
	var core = new Core();
	var fixtureEvent = 'someEvent';
	var fixtureArgs = 'someArbitraryArgument';

	t.plan(4);

	core.chainListener(fixtureEvent, function(args) {
		t.equal(args, fixtureArgs);
	}, function() {
		core.emit(fixtureEvent, fixtureArgs);
	});

	core.chainListener(fixtureEvent, function(args) {
		t.equal(args, fixtureArgs);
	}, function() {
		core.emit(fixtureEvent, fixtureArgs);
	});

	core.chainListener(fixtureEvent, function(args, prior) {
		t.equal(args, fixtureArgs);
		prior(args);
	}, function() {
		core.emit(fixtureEvent, fixtureArgs);
	});
});

test('Core#listen', function(t) {
	var _ = require('lodash');
	var EventEmitter = require('events');
	var core = new EventEmitter();

	var fixturePort = 80;
	var httpStub = {
		createServer: function() {
			return {
				assertHttpServer: function() {
					t.pass();
				},
				listen: function(port, done) {
					t.pass();
					t.equal(port, fixturePort);
					done();
				}
			};
		}
	};
	var apiListen = proxyquire('../lib/api/listen.js', {
		'http': httpStub
	});

	t.plan(4);

	core.listen = apiListen(_);

	core.on('listening', function(httpServer) {
		httpServer.assertHttpServer();
	});

	core.listen(fixturePort, function(httpServer) {
		httpServer.assertHttpServer();
	});
});
