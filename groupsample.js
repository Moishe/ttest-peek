function GroupSample() {
  this.groups = {};
}

GroupSample.prototype.update = function(group, value) {
  if (!value) {
    value = 1;
  }

  if (!this.groups[group]) {
    this.groups[group] = value;
  } else {
    this.groups[group] += value;
  }
};

GroupSample.prototype.df = function() {
  return Object.keys(this.groups).length - 1;
}

GroupSample.prototype.dump = function() {
  console.log(this.groups);
};

GroupSample.prototype.chiSquare = function(expected) {
  var cs = 0;
  for (var group in expected.groups) {
    if (expected.groups.hasOwnProperty(group)) {
      var o;
      if (!this.groups[group]) {
        o = 0;
      } else {
        o = this.groups[group];
      }
      e = expected.groups[group];
      cs += Math.pow(o - e, 2) / e;
    }
  }
  return cs;
};

GroupSample.prototype.pValue = function(expected) {
  var x2 = this.chiSquare(expected);
  var df = this.df();
  return this.pValueRecursive(x2, df);
};

GroupSample.prototype.pValueRecursive = function(x2, df) {
  var Pi = Math.PI;

  if (df == 1 && x2 > 1000) {
    return 0;
  }

  if (x2 > 1000 || df > 1000) {
    var q = this.pValueRecursive((x2 - df) * (x2 - df) / (2 * df), 1) / 2;
    if (x2 > df) {
      return q;
    }
    return 1 - q;
  }

  var p = Math.exp(-0.5 * x2);
  if ((df % 2) == 1) {
    p = p * Math.sqrt(2 * x2 / Pi);
  }
  var k = df;
  while(k >= 2) {
    p = p * x2 / k;
    k = k - 2;
  }
  var t = p;
  var a = df;
  while (t > 0.0000000001 * p) {
    a = a + 2;
    t = t * x2 / a;
    p = p + t;
  }
  return 1 - p;
}
