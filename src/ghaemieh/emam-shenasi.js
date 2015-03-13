var cheerio = require('cheerio');
var request = require('request');
var toMarkdown = require('to-markdown').toMarkdown;
var fs = require('fs')
var Entities = require('html-entities').XmlEntities;

entities = new Entities();

request(
    {
      method : 'GET',
      url : 'http://download.ghaemiyeh.com/downloads/htm/15000/381-f-13880101-emam-shenasi-j1.htm'
    }, function(err, response, body) {
      if (err)
        return console.error(err);

      $ = cheerio.load(body);

      var body = $('body').html();
      var mark = toMarkdown(body);

      fs.writeFile('data.md', entities.decode(mark), 'utf8', function() {
      })
      
    });