var fs = require('fs');
var _ = require('lodash');
var assert = require('assert');
var cheerio = require('cheerio');

function removeEOL(doc) {
  return doc.replace(/\r?\n|\r/g, '');
}

function addSeparator(doc) {
  var regex = /(.*?):<br>/g;
  doc = doc.replace(regex, function (match) {
    if (match.length <= 40) { // if colon (:) means title
      return ["</entry>", "<entry>", match].join('');
    } else {
      return match;
    }
  });

  doc = doc.replace(/<\/p>\r\n<hr>/gm, function (match) {
    return ["</entry>", match].join('');
  });
  doc = doc.replace(/\(\d+\) ?. /gm, function (match) {
    return ["</footnote>", "<footnote>", match].join('');
  });
  doc = doc.replace(/<\/h5>/gm, function (match) {
    return ["</footnote>", match].join('');
  });
  return doc;
}

function parseFootnote(doc) {
  $ = cheerio.load(doc, {
    decodeEntities: false
  });
  var list = [];
  $('footnote').each(function () {
    var footnote = $(this).html();

    var eolRegex = /\r\n/gi;
    footnote = footnote.replace(eolRegex, '');

    var regex = /\((\d+)\) ?. ?(.*)/i;

    var note = footnote.match(regex);

    list.push({
      index: note[1],
      note: note[2]
    });
  });
  return list;
}

function parseDoc(doc, footnotes) {
  $ = cheerio.load(doc, {
    decodeEntities: false
  });
  var list = [];
  $('entry').each(function () {
    var entry = $(this).html();
    var title = entry.split(/\r\n/)[0].replace(':<br>', '').trim();
    var regex = /\(<span class="aye">(.*)<\/span>\)<br>/i;
    var data = regex.exec(entry);

    var offset = null;
    var description = entry.replace(regex, function (match, a, off) {
      offset = off;
      return '';
    });
    if (offset) {
      description = description.substring(offset);
    } else {
      //TODO: check else block
    }

    var footnotesIdx = [];
var rgx = /\((\d+)\)/g;
    var match;
    while( (match = rgx.exec(description)) != null) {
      footnotesIdx.push(match[1]);
    }

    var notes = _.map(footnotesIdx, function (id) {
     return _.find(footnotes, function (footnote) {
        return footnote.index == id;
      })
    });

    list.push({
      title: title,
      aye: _.get(data, '[1]'),
      description: removeEOL(description),
      footnotes: notes
    });
  });
  return list;
}


function parsePage(doc, i) {
  doc = addSeparator(doc);

  var footnotes = parseFootnote(doc);
  var entries = parseDoc(doc, footnotes);

  //TODO: check which entries are lost
  if (entries.length !== footnotes.length) {
    console.log(i, entries.length, footnotes.length);
  }

  return {
    index: i,
    entries: entries
  };
}


fs.readFile('loghat-dar-tafsire-nemune.json', 'utf8', function (err, data) {
  if (err) throw err;
  var obj = JSON.parse(data);

  var db = [];
  for (var i = 0; i < obj.length; i++) {
    var doc = obj[i].content;
    db.push(parsePage(doc, i));
  }
  fs.writeFileSync('loghat-dar-tafsire-nemune.db.json', JSON.stringify(db), 'utf8');
});





