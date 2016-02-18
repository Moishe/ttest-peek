var x = 0;
function normalRand() {
    var u1 = Math.random();
    var u2 = Math.random();
    var r1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    var r2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    return [r1, r2];
}

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

function runTestWithVectors() {
  var numPairs = 10000;
  var samplePairs = [];
  var stopped = {};
  for (var i = 0; i < numPairs; i++) {
    samplePairs.push([new VectorSample(), new VectorSample()]);
  }

  var stopsThisRound;
  for (var i = 0; i < 100; i++) {
    stopsThisRound = 0;
    for (var j = 0; j < numPairs; j++) {
      if (stopped[j]) {
        continue;
      }
      a = normalRand();
      b = normalRand();

      samplePairs[j][0].update(a[0]);
      //samplePairs[j][0].update(a[1]);
      samplePairs[j][1].update(b[0]);
      //samplePairs[j][1].update(b[1]);

      pvalue = ttest(samplePairs[j][0], samplePairs[j][1]);
      if (pvalue < 0.05) {
        stopsThisRound += 1;
        stopped[j] = true;
        /*
        console.log('triggered stop: ' + pvalue);
        samplePairs[j][0].dump();
        samplePairs[j][1].dump();
        */
      }
    }

    console.log('stopsThisRound: ' + stopsThisRound);
  }

  var triggered = 0;
  for (var j = 0; j < numPairs; j++) {
    if (stopped[j]) {
      triggered += 1;
    } else {
      pvalue = ttest(samplePairs[j][0], samplePairs[j][1]);
      if (pvalue < 0.05) {
        triggered += 1;
      }
    }
  }

  console.log(triggered / numPairs + " false positive percentage.");
}

runTestWithVectors();
