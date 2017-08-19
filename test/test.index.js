'use strict';

const test = require('tape');

test('dispatch', t => {
	const core = require('../dist/eq8core.js')();
	const fixtureAction = 'someArbitraryAction';

	t.plan(1);
	core.on('dispatch', e => {
		t.equal(e, fixtureAction);
	});

	core.dispatch(fixtureAction);
});

test('subscribe', t => {
	const core = require('../dist/eq8core.js')();
	const fixtureQuery = 'someArbitraryQuery';
	const fixtureError = 'someArbitraryError';
	const fixtureResult = 'someArbitraryResult';

	t.plan(3);
	core.on('subscribe', (q, done) => {
		t.equal(q, fixtureQuery);
		done(fixtureError, fixtureResult);
	});

	core.subscribe(fixtureQuery, (err, result) => {
		t.equal(err, fixtureError);
		t.equal(result, fixtureResult);
	});
});
