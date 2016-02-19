var x = 0;
function normalRand() {
    var u1 = Math.random();
    var u2 = Math.random();
    var r1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    var r2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    return [r1, r2];
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

// defaults for number of runs can be calculated with experimentcalculator.com
function runTestWithGroups(container_name, unconverted, converted, daysToRun, testsToRun, expectedChange, pValueTrigger, stopOnPeek) {
  var triggered = [];
  var testPairs = [];

  var sampleViews = [];
  for (var i = 0; i < testsToRun; i++) {
    testPairs[i] = [new GroupSample(), new GroupSample()];
    sampleViews[i] = new GroupSampleView(container_name, i);
  }
  var slicesPerDay = 10;
  var i = 0;
  var interval = setInterval(function() {
    if (i >= daysToRun * slicesPerDay) {
      var triggeredCount = 0;
      for (var k = 0; k < testsToRun; k++) {
        var p = testPairs[k][0].pValue(testPairs[k][1]);
        if (triggered[k] || p <= pValueTrigger) {
          triggeredCount += 1;
        }
      }
      console.log((triggeredCount / testsToRun).toPrecision(3) + "% tests with p<0.05");
      clearInterval(interval);
      return;
    }
    var x = 0;
    for (var k = 0; k < testsToRun; k++) {
      if (triggered[k]) {
        continue;
      }

      for (var m = 0; m < 2; m++) {
        var a = 0;
        var b = 0;
        var c = Math.round((converted + unconverted) / slicesPerDay);
        var p = converted / (converted + unconverted);
        if (m == 1) {
          p *= 1 + expectedChange;
        }
        for (var j = 0; j < c / 2; j++) {
          if (Math.random() <= p) {
            a += 1;
          } else {
            b += 1;
          }
        }
        testPairs[k][m].update('converted', a);
        testPairs[k][m].update('unconverted', b);
      }

      var pvalue = testPairs[k][0].pValue(testPairs[k][1]);
      sampleViews[k].drawPair(pvalue, testPairs[k], pValueTrigger);
      if (stopOnPeek && pvalue <= pValueTrigger) {
        triggered[k] = true;
      }
    }
    i += 1;
  }, 1);
}

$( document ).ready(function() {
  runTestWithGroups('graph-1', 96000, 4000, 80, 100, 0.01, 0.05, false);
  runTestWithGroups('graph-2', 96000, 4000, 80, 100, 0.01, 0.05, true);
});
