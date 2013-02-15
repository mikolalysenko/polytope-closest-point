var numeric = require("numeric");

var EPSILON = 1e-8;

//Closest point to a point is trivial
function closestPoint0d(a, x, result) {
  var d = 0.0;
  for(var i=0; i<result.length; ++i) {
    result[i] = a[i];
    var t = a[i] - x[i];
    d += t * t;
  }
  return Math.sqrt(d);
}

//Computes closest point to a line segment
function closestPoint1d(a, b, x, result) {
  var denom = 0.0;
  var numer = 0.0;
  for(var i=0; i<a.length; ++i) {
    var ai = a[i];
    var bi = b[i];
    var xi = x[i];
    var s = (bi - ai) * bi;
    numer += (ai - bi) * xi + s;
    denom += ai * ai + s;
  }
  var t = 0.0;
  if(Math.abs(denom) > EPSILON) {
    t = numer / denom;
    if(t < 0.0) {
      t = 0.0;
    } else if(t > 1.0) {
      t = 1.0;
    }
  }  
  var ti = 1.0 - t;
  var d = 0;
  for(var i=0; i<x.length; ++i) {
    var r = t * a[i] + ti * b[i];
    result[i] = r;
    var s = x[i] - r;
    d += s * s;
  }
  return Math.sqrt(d);
}

//Computes closest point to a triangle
function closestPoint2d(a, b, c, x, result) {

}

//General purpose algorithm, uses quadratic programming, very slow
function closestPointnd(c, positions, x, result) {
  var D = numeric.rep([c.length, c.length], 0.0);
  var dvec = numeric.rep([c.length], 0.0);
  for(var i=0; i<c.length; ++i) {
    var pi = positions[c[i]];
    dvec[i] = numeric.dot(pi, x);
    for(var j=0; j<c.length; ++j) {
      var pj = positions[c[j]];
      D[i][j] = D[j][i] = numeric.dot(pi, pj);
    }
  }
  var A = numeric.rep([c.length, c.length+2], 0.0);
  var b = numeric.rep([c.length+2], 0.0);
  b[0] = 1.0-EPSILON;
  b[1] = -(1.0+EPSILON);
  for(var i=0; i<c.length; ++i) {
    A[i][0]   = 1;
    A[i][1]   = -1
    A[i][i+2] = 1;
  }
  var fortran_poop = numeric.solveQP(D, dvec, A, b);
  //If solver failed mysteriously, return NaN
  if(fortran_poop.message.length > 0 || isNaN(fortran_poop.value)) {
    for(var i=0; i<result.length; ++i) {
      result[i] = Number.NaN;
    }
    return Number.NaN;
  }
  //Otherwise, compute closest point and return
  var solution = fortran_poop.solution;
  for(var i=0; i<result.length; ++i) {
    result[i] = 0.0;
    for(var j=0; j<solution.length; ++j) {
      result[i] += solution[j] * positions[c[j]][i];
    }
  }
  return Math.sqrt(2.0 * fortran_poop.value[0] + numeric.dot(x,x));
}

function closestPoint(cell, positions, x, result) {
  switch(cell.length) {
    case 0:
      for(var i=0; i<result.length; ++i) {
        result[i] = Number.NaN;
      }
      return Number.NaN;
    case 1:
      return closestPoint0d(positions[cell[0]], x, result);
    case 2:
      return closestPoint1d(positions[cell[0]], positions[cell[1]], x, result);
    case 3:
      return closestPoint2d(positions[cell[0]], positions[cell[1]], positions[cell[2]], x, result);
    default:
      return closestPointnd(cell, positions, x, result);
  }
}
module.exports = closestPoint;

module.exports.closestPoint0d = closestPoint0d;
module.exports.closestPoint1d = closestPoint1d;
module.exports.closestPoint2d = closestPoint2d;
module.exports.closestPointnd = closestPointnd;