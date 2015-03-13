var cheerio = require('cheerio');
var request = require('request');
var toMarkdown = require('to-markdown').toMarkdown;
var fs = require('fs')

var url = 'data.md'

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(str) {
    return this.indexOf(str) == 0;
  };
}

function getFootnotes(data) {
  var regex = /^(\[\d+\])(.*)/gm;
  var result = data.match(regex);
  var fn = []
  for (i in result) {
    index = result[i].match(/\d+/)[0]
    fn[index] = result[i].match(/\[\d+\](.*)/)[1].trim();
  }
  return fn;
}

fs.readFile(url, 'utf8', function(err, data) {
  var footnotes = getFootnotes(data);
  var array = []
  array = data.toString().split("\n")
  for (i in array) {
    if (!array[i].startsWith('[')) {
      m = array[i].match(/\[(\d+)\]/)
      array[i] = array[i].replace(/\[(\d+)\]/g, function(a, b) {
        return '[^' + footnotes[b] + ']';
      });
    }
  }

  converted_data = array.join('\n')
  converted_data = converted_data.replace(/<span class="chapter">/g, '')
  converted_data = converted_data.replace(/<\/span>/g, '')
  converted_data = '<div dir=rtl>' + converted_data + '</div>'
  
  
  fs.writeFile('datafn.md', converted_data, null, null);
})
