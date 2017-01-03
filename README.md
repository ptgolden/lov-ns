# Linked Open Vocabularies namespaces
Namespace URIs and common prefixes for recommended RDF vocabularies derived
from the Open Knowledge Foundation's [Linked Open Vocabularies](http://lov.okfn.org/) (LOV)
collection.

# Use
Requiring this module simply returns an object containing key-value pairs for
each entry in the LOV collection. The keys are the prefix by which this
vocabulary is commonly known (i.e. in the Turtle RDF serialization). The value
will be the URL of the namespace resource.

```js
const lov = require('lov-ns')

const namespaces = {
  oa: lov.oa,
  dce: lov.dce,
  foaf: lov.foaf
}
```

If you do not want to pull in the entire LOV list to use only a few
vocabularies, you can require each individually:

```js
const namespaces = {
  oa: require('lov-ns/oa')
  dce: require('lov-ns/dce'),
  foaf: require('lov-ns/foaf'),
}
```

This package also comes with a command line program, `lov-ns`, which will
expand the prefix of a vocabulary contained in the LOV collection. For example,
running `lov-ns oa` will print `http://www.w3.org/ns/oa#` to stdout.
