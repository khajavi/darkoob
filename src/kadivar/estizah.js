var cheerio = require('cheerio');
var request = require('request');
var toMarkdown = require('to-markdown').toMarkdown;
var fs = require('fs')
var Entities = require('html-entities').XmlEntities;

entities = new Entities();

request(
    {
        method: 'GET',
        url: 'http://kadivar.com/?p=13402'
    }, function (err, response, body) {
        if (err)
            return console.error(err);

        $ = cheerio.load(body);

        var body = $('div.entry-content').html();
        var mark = toMarkdown(body);

        fs.writeFile('estizah.md', entities.decode(mark), 'utf8', function () {
        })

    });