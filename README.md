polytope-closest-point
======================
Computes the closest point on a convex polytope to a given point.

Install
=======

    npm install polytope-closest-point


### `require("polytope-closest-point")(cell, positions, x[, result])`

Computes the closest point in a polytope to `x`, storing the result in `result`.

* `cell` is a list of indices into a positions representing the vertices of the polytope.
* `positions` is an array of tuples representing the vertices of the polytope
* `x` is the point we are querying against
* `result` (optional) is the array to store the closest point in.

Returns a float representing the squared Euclidean distance from x to the polytope.  If no such point can be found, it returns Number.NaN

Credits
=======
(c) 2013 Mikola Lysenko. BSD
