function VectorSample() {
  this.n = 0;
  this.mean = 0;
  this.m2 = 0;
  this.buckets = [];
}

VectorSample.prototype.update = function(x) {
  this.n += 1;
  var delta = (x - this.mean);
  this.mean += delta / this.n;
  this.m2 += delta*(x - this.mean);

  var bucket = Math.floor((x + 2) * 5);
  if (bucket < 0 || bucket > 20) {
    return;
  }
  if (!this.buckets[bucket]) {
    this.buckets[bucket] = 1;
  } else {
    this.buckets[bucket] += 1;
  }
};

VectorSample.prototype.stdev = function() {
  return Math.sqrt(this.m2);
}

VectorSample.prototype.dump = function() {
  console.log([this.mean, this.m2, this.buckets].join());
};
