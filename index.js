var config = require('./config.json');
var auth = require('./lib/auth');

var autoDiscoverUrl = config.autoDiscoverUrl;
var username = config.username;
var password = config.password;

auth(autoDiscoverUrl, username, password)
	.then(function(token) {
		console.log('got token', token);
	})
	.catch(function(err) {
		console.log('error :(', err);
	});