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
function runTestWithGroups(unconverted, converted, daysToRun, testsToRun, pValueTrigger, stopOnPeek) {
  var triggered = [];
  var testPairs = [];

  var sampleViews = [];
  var container = $('#graph');
  for (var i = 0; i < testsToRun; i++) {
    testPairs[i] = [new GroupSample(), new GroupSample()];
    sampleViews[i] = new GroupSampleView(container, i);
  }
  var slicesPerDay = 1;
  var i = 0;
  var interval = setInterval(function() {
    if (i >= daysToRun * slicesPerDay) {
      var triggeredCount = 0;
      for (var k = 0; k < testsToRun; k++) {
        var p = testPairs[k][0].pValue(testPairs[k][1]);
        if (triggered[k] || p <= 0.05) {
          triggeredCount += 1;
          console.log("p: " + p);
          console.log("x2: " + testPairs[k][0].chiSquare(testPairs[k][1]));
          console.log("df: " + testPairs[k][0].df(testPairs[k][1]));
          testPairs[k][0].dump();
          testPairs[k][1].dump();
        }
      }
      console.log('triggeredCount: ' + triggeredCount);
      clearInterval(interval);
      return;
    }
    var x = 0;
    for (var k = 0; k < testsToRun; k++) {
      if (triggered[k]) {
        continue;
      }

      var groups = {'true': 0, 'false': 0};
      for (var j = 0; j < (converted + unconverted) / slicesPerDay; j++) {
        x += 1;
        for (var m = 0; m < 2; m++) {
          c = Math.random() < (converted / (converted + unconverted));
          groups[c] += 1;
          testPairs[k][m].update(c ? 'converted' : 'unconverted');
        }
      }

      var pvalue = testPairs[k][0].pValue(testPairs[k][1]);
      sampleViews[k].drawPair(pvalue, testPairs[k]);
      if (stopOnPeek && pvalue <= 0.05) {
        triggered[k] = true;
      }
    }
    i += 1;
    console.log(i);
  }, 1);
/*
*/
}

$( document ).ready(function() {
  runTestWithGroups(96000, 4000, 80, 100, 0.05, false);
});
