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
  return Object.keys(this.groups).length;
}

GroupSample.prototype.dump = function() {

}

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
}

var expected = new GroupSample();
expected.update('red', 100);
expected.update('blue', 50);

var observed = new GroupSample();
observed.update('red', 90);
observed.update('blue', 60);

console.log('chi-square: ' + observed.chiSquare(expected));
