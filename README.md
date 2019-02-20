# Vega Transform for OmniSci Core

Data transform to load data from an [OmniSci Core](https://www.omnisci.com/platform/core/) database in [Vega](https://vega.github.io/vega/).

This package extends Vega's set of data transforms to support loading data from a database in Vega version 5.0 and higher. 

## Usage Instructions

Install the transform with

```
yarn add vega-transform-omnici-core
```

To use the core transform, you must set the `session`. To create a session, create a connection and connect to it. Then assign the session to the Core transform with `Core.sesssion(session)`.

```js
Core.session(session);
transforms["core"] = Core;
```

Here is a complete example.

```js
import "@mapd/connector/dist/browser-connector";
import CoreTransform from "vega-transform-core";
import vega from "vega";

const connection = new window.MapdCon()
  .protocol("https")
  .host("metis.mapd.com")
  .port("443")
  .dbName("mapd")
  .user("mapd")
  .password("HyperInteractive");

// connect to core database and create a transform with a handle to the session
connection.connectAsync().then(session => {
  // pass the session to the core transform
  CoreTransform.session(session);

  // register OmniSci Core transform as "core"
  vega.transforms["core"] = CoreTransform;

  // now you can use the transform in a Vega spec
  const view = new vega.View(vega.parse(spec))
    .initialize(document.querySelector("#vis"))
    .run();
});
```

### Vega Specifications

Once `vega-transform-core` has been imported and registered, Vega specs can reference the transform and get data from Core like so:

```json
{
  "data": [
    {
      "name": "table",
      "transform": [{
        "type": "core",
        "query": "select count(*) from flights_donotmodify"
      }]
    }
  ]
}
```
