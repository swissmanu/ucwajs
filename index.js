var config = require('./config.json');
var auth = require('./lib/auth');
var autoDiscover = require('./lib/autoDiscover');
var application = require('./lib/application');

var autoDiscoverUrl = config.autoDiscoverUrl;
var username = config.username;
var password = config.password;

auth(autoDiscoverUrl, username, password)
	.then(function(token) {
		return autoDiscover(autoDiscoverUrl, 'user')
			.then(function(userUrl) { return [ token, userUrl ]; })
			.spread(application)
			.then(function(application) {
				console.log(application);
			})
	})
	.catch(function(err) {
		console.log('error :(');
	});



