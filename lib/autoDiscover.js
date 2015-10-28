var debug = require('debug')('ucwajs:autodiscover');
var superagent = require('superagent');
var Q = require('q');

module.exports = function autoDiscoverResourceFactory(config) {
	return fetchAutoDiscover.bind(this, config.autoDiscoverUrl);
};

function fetchAutoDiscover(autoDiscoverUrl, token) {
	debug('fetchAutoDiscover ' + autoDiscoverUrl);

	var deferred = Q.defer();
	var request = superagent.get(autoDiscoverUrl);

	if(token) {
		request.set({ Authentication: 'Bearer ' + token });
	}

	request.end(function(err, res) {
			if(res.ok) {
				debug('Got autodiscover');
				deferred.resolve(res.body);
			} else {
				debug('Got error from API');
				deferred.reject(err);
			}
		});

	return deferred.promise;
}