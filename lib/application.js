var debug = require('debug')('ucwajs:application');
var superagent = require('superagent');
var Q = require('q');
var uuid = require('node-uuid');

module.exports = function getApplications(token, userUrl) {
	debug('getApplications');
	var deferred = Q.defer();

	superagent
		.get(userUrl)
		.set('Authorization', 'Bearer ' + token)
		.end(function(err, res) {
			debug('Got links');

			if(res.ok) {
				superagent
					.post(res.body._links.applications.href)
					.send({
						UserAgent: 'ucwajs',
						EndpointId: uuid.v4(),
						Culture: 'en-US'
					})
					.set('Authorization', 'Bearer ' + token)
					.end(function(err, res) {
						if(res.ok) {
							debug('Got application');
							deferred.resolve(res.body);
						} else {
							debug('Could not fetch application');
							deferred.reject(err);
						}
					});
			} else {
				debug('Could not fetch links');
				deferred.reject(err);
			}
		});

	return deferred.promise;
}