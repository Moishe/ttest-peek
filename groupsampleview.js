var redGradient = new Rainbow();
redGradient.setSpectrum('#FF3333', '#FFEEEE');
redGradient.setNumberRange(0, 0.05);

var greenGradient = new Rainbow();
greenGradient.setSpectrum('#EEFFEE', '#33FF33');
greenGradient.setNumberRange(0.05, 1);

function GroupSampleView(container, id) {
  this.id = container + '-pair-' + id;
  var text = "<div class='pair-view' id='" + this.id + "'></div>";
  $('#' + container).append(text);
}

GroupSampleView.prototype.drawPair = function(pvalue, pair, pValueTrigger) {
  //var bkg = rainbow.colourAt(pvalue);
  if (pvalue < pValueTrigger) {
    $('#' + this.id).css('background', '#' + redGradient.colourAt(pvalue));
  } else {
    $('#' + this.id).css('background', '#' + greenGradient.colourAt(pvalue));
  }

  p1 = (pair[0].groups['converted'] / (pair[0].groups['unconverted'] + pair[0].groups['converted']) * 100).toPrecision(3);
  p2 = (pair[1].groups['converted'] / (pair[1].groups['unconverted'] + pair[1].groups['converted']) * 100).toPrecision(3);
  $('#' + this.id).html(p1 + "<br>" + p2);
}
