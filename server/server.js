/**
 * Created by nbugash on 02/03/16.
 */
var express = require('express');
var server = express();
var port = 5000;

server.use(express.static('chrome-plugin'));
server.use(express.static('server/views'));
server.listen(port, function(err){
	if (err) {
		console.log('Error: ' + err);
	} else {
		console.log('Running server on port: ' + port);
	}
});