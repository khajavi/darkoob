/*jshint devel:true, phantom:true*/
/**
 * PhantomJS Cookbook Chapter 3 | Working with webpage Objects Recipe 9 |
 * Simulating scrolling in PhantomJS
 */
var webpage = require('webpage').create();
var fs = require('fs');
var jquery = "jquery.min.js";

webpage.viewportSize = {
  width : 1280,
  height : 800
};
webpage.scrollPosition = {
  top : 0,
  left : 0
};

webpage.open('http://fa-ir.facebook.com/abdolkarimi.org', function(status) {
  if (status === 'fail') {
    console.error('webpage did not open successfully');
    phantom.exit(1);
  }
  webpage.injectJs(jquery);

  var i = 0, top, queryFn = function() {
    return document.body.scrollHeight;
  };

  setInterval(function() {
    var filename = 'twitter-' + (++i) + '.png';
    console.log('Writing ' + filename + '...');

    top = webpage.evaluate(queryFn);

    console.log('[' + i + '] top = ' + top);
    webpage.scrollPosition = {
      top : top + 1,
      left : 0
    };
    
    if (i >= 70) {

      var res = webpage.evaluate(function() {
        var links = [];
        var result = $('.userContentWrapper').each(function(i, v) {
          links.push($(v).html().trim());
        });
        return links;
      });
      webpage.render('b.png');

      console.log(res.length);
      fs.write('data.txt', JSON.stringify(res), 'w');
      phantom.exit();
    }
  }, 700);
});