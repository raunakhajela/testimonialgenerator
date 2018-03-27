// var http = require('http');
// var fs = require('fs');

// http.createServer(function (req,res) {
// 	res.writeHead(200, { 'Content-type':'text/html'} );
// 	var html = fs.readFileSync(__dirname + '/web tg/index.html');
// 	res.end(html);

// }).listen(1555, 'localhost');

var express = require('express');
var app = express();
var fs = require('fs');

// app.use('/css',express.static(__dirname + '/css'));

// app.use('/js',express.static(__dirname + '/js'));

// app.use('/img',express.static(__dirname + '/img'));

// app.use('/fonts',express.static(__dirname + '/fonts'));

app.use('/assets',express.static(__dirname + '/'));


//var port = process.env.PORT || 5720 ;

app.get('/',function(req,res) {
	var html = fs.readFileSync(__dirname + '/index.html','utf8');
	res.send(html);
});



app.listen(80,'127.0.0.1');