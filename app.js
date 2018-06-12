//var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
//var shell = require('shelljs');
var express = require('express');
var app = express();
var path = require('path');

app.post('/api/parse', function(req, res){
//http.createServer(function (req, res) {
  if (req.url == '/api/parse') {
    //fs.unlinkSync(__dirname + '/uploads/' + 'output.txt');
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
            var result = data.replace(/(Oracle|RedHat|MS Windows)/g, '$1©');

            fs.writeFile(__dirname + '/uploads/output.txt', result, 'utf8', function (err) {
              if (err) return console.log(err);
              res.sendFile(__dirname + '/uploads/' + 'output.txt');
            });
          });
        //shell.sed('-i', 'Oracle','Oracle2', __dirname + '/uploads/' + files.filetoupload.name);

        //res.end();
      });
 });
  } 
})

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
