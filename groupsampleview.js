var rainbow = new Rainbow();
rainbow.setSpectrum('red', 'green', '#00ff00');
rainbow.setNumberRange(0, 1);

function GroupSampleView(container, id) {
  this.id = 'pair-' + id;
  var text = "<div class='pair-view' id='" + this.id + "'></div>";
  $('#graph').append(text);
}

GroupSampleView.prototype.drawPair = function(pvalue, pair) {
  var bkg = rainbow.colourAt(pvalue);
  if (pvalue < 0.05) {
    $('#' + this.id).css('background', 'red');
  } else {
    $('#' + this.id).css('background', 'green');
  }

  p1 = (pair[0].groups['converted'] / (pair[0].groups['unconverted'] + pair[0].groups['converted']) * 100).toPrecision(3);
  p2 = (pair[1].groups['converted'] / (pair[1].groups['unconverted'] + pair[1].groups['converted']) * 100).toPrecision(3);
  $('#' + this.id).html(p1 + "<br>" + p2);
}
