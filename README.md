# eq8-core
EQuateJS Core API Library

## Installation

```
npm install --save eq8-core
```

## API

```
var Core = require('eq8-core');
var api = new Core();
```

### Event: 'trigger'

Emitted when `Core#trigger` gets called

### Event: 'search'

Emitted when `Core#search` gets called

### Event: 'listening'

Emitted when the created `http.Server` object starts listening after a `Core#listen` method call

### new Core([options])

Constructor for this EQuateJS Core API library - i.e. `eq8-core`

#### Parameters:

- `options` is an optional object
  - `logger` is a `winston.Logger` options object
  - `on` is an object with the following properties:
     - `trigger` is an array of `trigger` event listeners
     - `search` is an array of `search` event listeners
     - `listening` is an array of `listening` event listeners

### Core#chainListener(e, listener, done)

Similar to `EventEmitter.addListener` except it removes the previously chained listener and adds it as a `prior` argument for the newly chained listener.

#### For example:

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

async.parallel([
  function(done) {
    api.chainListener('trigger', bottomOfStack, done);
  },
  function(done) {
    api.chainListener('trigger', topOfStack, done); 
  }
], function parallelDone() {
  api.trigger('someEvent');
});
```

#### Result:

```
topOfStack: someEvent
bottomOfStack: someEvent
```

#### Parameters:

- `e` is the event name - see list of events above
- `listener` is the handler for the event
- `done` is the callback function that gets called after the listener chaining lifecycle

### Core#addRegistrar(registrars, done)

Chains a listener for `register:<registryKey>` events that occur during a `Core#register` method call

#### For example:

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

#### Result:

```
create actions: [ { e: 'e1' }, { e: 'e2' } ]
create views: [ { q: 'q1' }, { q: 'q2' } ]
```

#### Parameters:

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

#### Parameters:

- `registries` is an object that takes the form:

```
{
  registryKey1: registryInitObj1,
  ...
}
```


- `done` is an optional error-first callback function that gets called after the registration lifecycle

### Core#trigger(e, done)

Emits a `trigger` event and passes the parameters `e` and `done` to the event handler

#### Parameters:

- `e` is an arbitrary object to represent a command event
- `done` is an optional arbitrary callback function but conventionally takes an error-first argument: `var done = function(err, ...){ ...}`

### Core#search(q, done)

Emits a `search` event and passes the parameters `q` and `done` to the event handler

#### Parameters:

- `q` is an arbitrary object to represent a query event
- `done` is an arbitrary callback function but conventionally takes an error-first argument: `var done = function(err, ...){ ...}`

### Core#listen(port, done)

Creates an `http.Server` object and emits a `listening` event

#### Parameters:

- `port` is an integer that the created `http.Server` object will be listening to
- `done` is a callback function that accepts an `http.Server` argument: `var done = function(httpServer){ ... }`