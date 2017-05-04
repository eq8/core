# eq8-core

[![npm](https://img.shields.io/npm/v/eq8-core.svg?maxAge=2592000)](https://npmjs.com/package/eq8-core) [![node](https://img.shields.io/node/v/eq8-core.svg?maxAge=2592000)](https://npmjs.com/package/eq8-core) [![David](https://img.shields.io/david/eq8/eq8-core.svg?maxAge=2592000)](https://david-dm.org/eq8/eq8-core) [![Travis](https://travis-ci.org/eq8/eq8-core.svg?branch=master)](https://travis-ci.org/eq8/eq8-core) [![codecov](https://codecov.io/gh/eq8/eq8-core/branch/master/graph/badge.svg)](https://codecov.io/gh/eq8/eq8-core)

EQuateJS Core API Library - A loose interface for [CQRS](http://martinfowler.com/bliki/CQRS.html)/[ES](http://martinfowler.com/eaaDev/EventSourcing.html)

## Overview

The core building blocks are:

- commands in the form of **events** for updating the application state; and,
- **queries** are used for returning the current state of the application.

The core API provides an ability to register handlers for events and queries, but more importantly, it also allows adding new registrars:

- **registrars** are layers of abstractions that map to sets of events or queries.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Installation](#installation)
- [Events](#events)
  - [Event: 'dispatch'](#event-dispatch)
  - [Event: 'subscribe'](#event-subscribe)
  - [Event: 'register:*registry*'](#event-registerregistry)
- [Constructor](#constructor)
  - [Parameters](#parameters)
- [Methods](#methods)
  - [Core#dispatch(e, done)](#coredispatche-done)
    - [Parameters](#parameters-1)
  - [Core#subscribe(q, done)](#coresubscribeq-done)
    - [Parameters](#parameters-2)
  - [Core#chainListener(e, listener, done)](#corechainlistenere-listener-done)
    - [Parameters](#parameters-3)
  - [Core#addRegistrar(registrars, done)](#coreaddregistrarregistrars-done)
    - [Parameters](#parameters-4)
  - [Core#register(registries, done)](#coreregisterregistries-done)
    - [Parameters](#parameters-5)
- [Appendices](#appendices)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install --save eq8-core
```

## Events

Basically, `eq8-core` extends the [`EventEmitter`](https://nodejs.org/dist/latest-v4.x/docs/api/events.html#events_class_eventemitter) class and has the following events:

### Event: 'dispatch'

Emitted when `Core#dispatch` gets called

### Event: 'subscribe'

Emitted when `Core#subscribe` gets called

### Event: 'register:*registry*'

Emitted when `Core#register` gets called for a specific *registry*

## Constructor

```
var Core = require('eq8-core');
var api = new Core(options);
```

### Parameters

- `options` is an optional object
  - `logger` is a `winston.Logger` options object
  - `on` is an object with the following properties:
     - `dispatch` is an array of `dispatch` event listeners
     - `subscribe` is an array of `subscribe` event listeners

## Methods

### Core#dispatch(e, done)

Emits a `dispatch` event and passes the parameters `e` and `done` to the event handler

#### Parameters

- `e` is an arbitrary object to represent a command event

### Core#subscribe(q, done)

Emits a `subscribe` event and passes the parameters `q` and `done` to the event handler

#### Parameters

- `q` is an arbitrary object to represent a query event
- `done` is an arbitrary callback function but conventionally takes an error-first argument: `var done = function(err, ...){ ...}`

### Core#chainListener(e, listener, done)

Similar to `EventEmitter.addListener` except it removes the previously chained listener and adds it as a `prior` argument for the newly chained listener.

**For example:**

```
var Core = require('eq8-core');
var api = new Core();
var async = require('async');

function bottomOfStack(e, done) {
  console.log('bottomOfStack', e);
  done();
}

function topOfStack(e, done, prior) {
  console.log('topOfStack:', e);
  prior(e, done);
}

async.series([
  function(done) {
    api.chainListener('dispatch', bottomOfStack, done);
  },
  function(done) {
    api.chainListener('dispatch', topOfStack, done); 
  }
], function seriesDone() {
  api.dispatch('someEvent');
});
```

**Result:**

```
topOfStack: someEvent
bottomOfStack: someEvent
```

#### Parameters

- `e` is the event name - see list of events above
- `listener` is the handler for the event
- `done` is the callback function that gets called after the listener chaining lifecycle

### Core#addRegistrar(registrars, done)

Chains a listener for `register:<registryKey>` events that occur during a `Core#register` method call

**For example:**

```
var Core = require('eq8-core');
var api = new Core();

var registrars = {
  'actions': function createAction(actions) {
    console.log('create actions:', actions);
  },
  'views': function createView(views) {
    console.log('create views:', views);
  }
};
api.addRegistrar(registrars);

var registries = {
  'actions': [
    {e: 'e1'},
    {e: 'e2'}
  ],
  'views': [
    {q: 'q1'},
    {q: 'q2'}
  ]
};
api.register(registries);

```

**Result:**

```
create actions: [ { e: 'e1' }, { e: 'e2' } ]
create views: [ { q: 'q1' }, { q: 'q2' } ]
```

#### Parameters

- `registrars` is an object that takes the form:

```
{
  'registryKey<n>': function handler(registryInitObj){},
  ...
}
``` 

- `done` is an optional error-first callback function that gets called after the registrar adding lifecycle

### Core#register(registries, done)

Triggers a `register:<registryKey>` event for each `registryKey<n>` in `registries`

**NOTE:** See usage example in `Core#addRegister`

#### Parameters

- `registries` is an object that takes the form:

```
{
  registryKey1: registryInitObj1,
  ...
}
```


- `done` is an optional error-first callback function that gets called after the registration lifecycle


## Appendices

- [Contributing] (./CONTRIBUTING.md)
- [License] (./LICENSE)
