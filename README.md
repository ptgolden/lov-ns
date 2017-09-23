# Linked Open Vocabularies namespaces
Namespace URIs and common prefixes for recommended RDF vocabularies derived
from the Open Knowledge Foundation's [Linked Open Vocabularies](http://lov.okfn.org/) (LOV)
collection.

This library is conceptually similar to Kjetil Kjernsmo's [RDF::NS::Curated](https://metacpan.org/pod/RDF::NS::Curated) package for Perl, as well as the Website <http://prefix.cc/>.

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

Following [semantic versioning](http://semver.org), breaking changes in the dataset (i.e. a change in a namespace's metadata) will result in a major version bump.

# Updating
To update the dataset, run `npm run update-lov`. This will perform three steps:

  1. Fetch the dataset and create derived namspace files (the `index.js` and `data.json` files in the child directories)

  2. If there have been any changes, these will be commited with an automatic message

  3. If there were any changes committed, the package version will be updated. If there were nothing but additions in the commit, this will be a minor version bump. Otherwise, it will be a major version bump.
