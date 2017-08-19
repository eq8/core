# @eq8/core

[![David](https://img.shields.io/david/eq8/core.svg?maxAge=2592000)](https://david-dm.org/eq8/core) [![Travis](https://travis-ci.org/eq8/core.svg?branch=master)](https://travis-ci.org/eq8/core) [![codecov](https://codecov.io/gh/eq8/core/branch/master/graph/badge.svg)](https://codecov.io/gh/eq8/core)

EQuateJS Core API Library - A loose interface for [CQRS](http://martinfowler.com/bliki/CQRS.html)/[ES](http://martinfowler.com/eaaDev/EventSourcing.html)

**NOTE:** The package `eq8-core` can be found in the `legacy` branch.

## Overview

The core building blocks are:

- commands in the form of **events** for updating the application state; and,
- **queries** are used for returning the current state of the application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Installation](#installation)
- [Events](#events)
  - [Event: 'dispatch'](#event-dispatch)
  - [Event: 'subscribe'](#event-subscribe)
- [Constructor](#constructor)
  - [Parameters](#parameters)
- [Methods](#methods)
  - [Core#dispatch(e, done)](#coredispatche-done)
    - [Parameters](#parameters-1)
  - [Core#subscribe(q, done)](#coresubscribeq-done)
    - [Parameters](#parameters-2)
- [Appendices](#appendices)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install --save @eq8/core
```

## Events

Basically, `@eq8/core` is an [`EventEmitter`](https://nodejs.org/dist/latest-v4.x/docs/api/events.html#events_class_eventemitter) object and has the following events:

### Event: 'dispatch'

Emitted when `Core#dispatch` gets called

### Event: 'subscribe'

Emitted when `Core#subscribe` gets called

## Constructor

```
var core = require('@eq8/core')(options);
```

### Parameters

- `options` is an optional object with the following attributes:
  - `logger` by default is `winston` object

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

## Appendices

- [Contributing] (./CONTRIBUTING.md)
- [License] (./LICENSE)
