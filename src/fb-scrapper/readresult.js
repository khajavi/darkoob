var fs = require('fs');
var cheerio = require('cheerio');

fs.readFile('data.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var links = JSON.parse(data);
//  console.log(links[0])
  
  var posts = [];
  
  links.forEach(function(v, i) {
    var post = {};
    $ = cheerio.load(v);
    post.date = $('abbr[data-utime]').text();
    post.content = $('.userContent').text();
    posts.push(post);
  });
  
  
  console.log(posts);
  
  fs.writeFile('posts.json', JSON.stringify(posts), null)
});

