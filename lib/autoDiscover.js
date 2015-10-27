var debug = require('debug')('ucwajs:autodiscover');
var superagent = require('superagent');
var Q = require('q');

module.exports = function fetchAndExtractFromAutoDiscover(autoDiscoverUrl, linkToExtract) {
	debug('fetchAndExtractFromAutoDiscover ' + autoDiscoverUrl + ' ' + linkToExtract);

	var deferred = Q.defer();

	superagent
		.get(autoDiscoverUrl)
		.end(function(err, res) {
			if(res.ok) {
				if(res.body._links[linkToExtract].href) {
					debug('Got ' + linkToExtract);
					deferred.resolve(res.body._links[linkToExtract].href);
				} else {
					debug('Could not extract ' + linkToExtract);
					deferred.reject(new Error('Could not extract ' + linkToExtract));
				}
			} else {
				debug('Got error from API');
				deferred.reject(err);
			}
		});

	return deferred.promise;
}