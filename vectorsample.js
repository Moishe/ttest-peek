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


var PiD2 = Math.PI / 2;

// note that I copied a bunch of this code from:
// https://home.ubalt.edu/ntsbarsh/business-stat/otherapplets/pvalues.htm#rtdist
function StatCom(q, i, j, b) {
  var zz = 1;
  var z = zz;
  var k = i;
  while(k <= j) {
    zz = zz * q * k / (k - b);
    z = z + zz;
    k = k + 2
  }
  return z
}

function ttest(a, b) {
  astdev = a.stdev();
  bstdev = b.stdev();
  tvalue = (a.mean - b.mean) / ((astdev / a.n) + (bstdev / b.n));

  astdev2 = astdev * astdev;
  bstdev2 = bstdev * bstdev;
  df = ((astdev2 / a.n) + (bstdev2 / b.n)) / ((1 / a.n) * (astdev2 / a.n) + (1 / b.n) * (bstdev2 / b.n));

  var w = Math.abs(tvalue) / Math.sqrt(df);
  var th = Math.atan(w)

  var sth = Math.sin(th);
  var cth = Math.cos(th)
  if ((df % 2) == 1) {
    p = 1 - (th + sth * cth * StatCom(cth * cth, 2, df-3, -1)) / PiD2;
  }
  else {
    p = 1 - sth * StatCom(cth * cth, 1, df-3, -1);
  }

  return p;
}
