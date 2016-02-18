function GroupSample() {
  this.groups = {};
}

GroupSample.prototype.update = function(group) {
  if (!this.groups[group]) {
    this.groups[group] = 1;
  } else {
    this.groups[group] += 1;
  }
};

GroupSample.prototype.dump = function() {

}

