var formidable = require('formidable');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var contents = fs.readFileSync(__dirname + '/Keyword.txt', { "encoding": "utf8"});
var keywords = contents.replace(/ *\n/g,'|');
var keywords = keywords.replace(/\|$/,'');
var regexpfilter = '/(' + keywords + ')/g'

  console.log(regexpfilter);

  app.post('/api/parse', function(req, res){
    if (req.url == '/api/parse') {
      var form = new formidable.IncomingForm({
        uploadDir: __dirname + '/uploads',
        keepExtensions: true
      });

      form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = __dirname + '/uploads/' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
            fs.readFile( __dirname + '/uploads/' + files.filetoupload.name, 'utf8', function (err,data) {
              if (err) {
                return console.log(err);
              }

              //var result = data.replace( regexpfilter , '$1©'); <- this does not work
              var result = data.replace( /(Oracle|Unicode|Microsoft|SAP|Dynatrace)/gi, '$1©');

              fs.writeFile(__dirname + '/uploads/output.txt', result, 'utf8', function (err) {
                if (err) return console.log(err);
                res.sendFile(__dirname + '/uploads/' + 'output.txt');
              });
            });
          });
        });
      }
    })

    var server = app.listen(3000, function(){
      console.log('Server listening on port 3000');
});
