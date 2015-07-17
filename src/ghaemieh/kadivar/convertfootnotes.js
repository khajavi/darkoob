var cheerio = require('cheerio');
var request = require('sync-request');
var toMarkdown = require('to-markdown').toMarkdown;
var fs = require('fs');
var Entities = require('html-entities').XmlEntities;
entities = new Entities();

var url = 'estizah.md';

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}

String.prototype.toEnglishDigits = function () {
    var id = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    var num_dic = {
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9',
    }

    return parseInt(this.replace(/[۰-۹]/g, function (w) {
        return num_dic[w]
    }));
}

function getFootnotes(data) {
    var regex = /^(\[[۰,۱-۹]])(.*)/gm;
    var result = data.match(regex);
    var fn = [];
    for (i in result) {
        index = result[i].match(/[۰-۹]/)[0].toEnglishDigits();
        fn[index] = result[i].match(/\[[۱-۹,۰]].(.*)/)[1].trim();
    }
    return fn;
}


function flat_footnotes(data, title) {
    var footnotes = getFootnotes(data);
    var array = [];
    array = data.toString().split("\n");
    array = array.filter(function (line) {
        return !line.startsWith('[')
    });
    for (i in array) {
        if (!array[i].startsWith('[')) {
            array[i] = array[i].replace(/\[([۰-۹])]/g, function (matched, foot_note_index) {
                return '_(ش.پ.' + footnotes[foot_note_index.toEnglishDigits()].trim() + 'پ.پ._)';
            });
        }
    }


    converted_data = array.join('\n');
    //fs.writeFile('book/' + title + '.fn.md', converted_data, null, null);
    return converted_data;
}


getFootnotes('sdfdf');

//fs.readFile(url, 'utf8', flat_footnotes)

var index = 0;

fs.readFile("bookurls.json", 'utf8', function (err, data) {
    book = JSON.parse(data);

    for (section in book.contents) {
        for (chapter in book.contents[section].contents) {
            convertToMarkdown(book.contents[section].contents[chapter].url, book.contents[section].contents[chapter].title);
        }
    }
});

var convertToMarkdown = function (url, title) {
    res = request('GET', url)

    ++index;

    console.log(index)
    $ = cheerio.load(res.getBody());

    var body = $('div.entry-content').html();


    var mark = toMarkdown(body);
    mark = "# " + title + "\n\n" + mark
    //console.log(entities.decode(mark).split("\n"))

    fs.writeFileSync('book/' + index + ". " + title + '.md', flat_footnotes(entities.decode(mark)), 'utf8', function () {
    })


}


