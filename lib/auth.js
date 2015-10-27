var debug = require('debug')('ucwajs:auth');
var autoDiscover = require('./autoDiscover');
var Q = require('q');
var superagent = require('superagent');

module.exports = function auth(autoDiscoverUrl, username, password) {
	return autoDiscover(autoDiscoverUrl, 'user')
		.then(fetchOAuthUrl)
		.then(function(oAuthUrl) { return [ oAuthUrl, username, password ]; })
		.spread(fetchOAuthToken);
};


function fetchOAuthUrl(authUrl) {
	debug('fetchOAuthUrl ' + authUrl);

	var deferred = Q.defer();

	superagent
		.get(authUrl)
		.end(function(err, res) {
			if(err && err.status === 401) {
				debug('Got unauthorized from API as expected');
				var wwwAuthenticateHeader = res.header['www-authenticate'];
				var matches = (/MsRtcOAuth href="([^\"]*)"/g).exec(wwwAuthenticateHeader);

				if(matches.length >= 2) {
					debug('Extracted OAuth url');
					var oAuthUrl = matches[1];
					deferred.resolve(oAuthUrl);
				} else {
					debug('Could not extract OAuth url');
					deferred.reject(new Error('Could not extract OAuth url'));
				}
			} else {
				debug('Did not receive unauthorized from API as we would expect');
				deferred.reject(new Error('Did not receive status code 401 as expected'));
			}
		});

	return deferred.promise;
}

function fetchOAuthToken(oAuthUrl, username, password) {
	debug('fetchOAuthToken ' + oAuthUrl);

	var deferred = Q.defer();

	superagent
		.post(oAuthUrl)
		.type('form')
		.send({
			grant_type: 'password',
			username: username,
			password: password
		})
		.end(function(err, res) {
			if(res.ok) {
				if(res.body.access_token) {
					debug('Receive OAuth token');
					deferred.resolve(res.body.access_token);
				} else {
					debug('Could not read OAuth token from response');
					deferred.reject(new Error('Could not read OAuth token from response'));
				}
			} else {
				debug('Recived non-OK response from API');
				deferred.reject(err);
			}
		});

	return deferred.promise;
}
