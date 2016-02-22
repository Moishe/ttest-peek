var redGradient = new Rainbow();
redGradient.setSpectrum('#FFEEEE', '#FF3333');
redGradient.setNumberRange(0.01, 1);

var greenGradient = new Rainbow();
greenGradient.setSpectrum('#33FF33', '#EEFFEE');
greenGradient.setNumberRange(0, 0.05);

function GroupSampleView(container, id) {
  this.id = container + '-pair-' + id;
  this.historicalValues = [];
  var text = "<div class='pair-view' id='" + this.id + "'></div>";
  $('#' + container).append(text);
}

GroupSampleView.prototype.drawPair = function(pvalue, pair, pValueTrigger) {
  //var bkg = rainbow.colourAt(pvalue);
  this.historicalValues.push(pvalue);
  $('#' + this.id).sparkline(this.historicalValues, { width: 40 });

  if (pvalue < pValueTrigger) {
    $('#' + this.id).css('background', '#' + greenGradient.colourAt(pvalue));
  } else {
    $('#' + this.id).css('background', 'white');
  }
/*
  p1 = (pair[0].groups['converted'] / (pair[0].groups['unconverted'] + pair[0].groups['converted']) * 100).toPrecision(3);
  p2 = (pair[1].groups['converted'] / (pair[1].groups['unconverted'] + pair[1].groups['converted']) * 100).toPrecision(3);
  $('#' + this.id).html(p1 + "<br>" + p2);
  */

}
