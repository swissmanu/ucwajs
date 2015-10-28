var debug = require('debug')('ucwajs');
var util = require('util');
var superagent = require('superagent');


var config = require('./config.json');

var autoDiscoverResource = require('./lib/autoDiscover')(config);
var auth = require('./lib/auth')(config, autoDiscoverResource);
var applicationResourceFactory = require('./lib/application');
var Events = require('./lib/events');

var autoDiscoverUrl = config.autoDiscoverUrl;
var username = config.username;
var password = config.password;


auth(autoDiscoverResource, username, password)
	.then(function(token) { 
		debug('Successfully got token from auth module');

		return autoDiscoverResource(token)
			.then(function(autoDiscover) {
				return applicationResourceFactory(config, token, autoDiscover._links.user.href)()
					.then(function(application) {
						//console.log(util.inspect(application, { depth: null }));
						
						// Start Event listener:
						var events = new Events(token);
						events.on('event', function(data) {
							//console.log(util.inspect(data, { depth: null }));

							data.forEach(function(sender) {
								if(sender.rel === 'people') {
									var contactPresenceEvents = sender.events.filter(function(event) {
										return event.link.rel === 'contactPresence';
									});
									
									contactPresenceEvents.forEach(function(contactPresenceEvent) {
										superagent
											.get('https://uccweb.finnova.com' + contactPresenceEvent.link.href)
											.set('Authorization', 'Bearer ' + token)
											.end(function(err, res) {
												console.log(res.body.availability)
											});
									});
								}
							})


						});
						events.start('https://uccweb.finnova.com' + application._links.events.href);

						// Subscribe to messaging:
						// var makeMeAvailable = 'https://uccweb.finnova.com' + application._embedded.me._links.makeMeAvailable.href;
						// superagent
						// 	.post(makeMeAvailable)
						// 	.set('Authorization', 'Bearer ' + token)
						// 	.send({
						// 		supportedMessageFormats: [ 'Plain' ],
						// 		supportedModalities: [ 'Messaging', 'PhoneAudio']
						// 	})
						// 	.end(function(err, res) {
						// 		if(err) {
						// 			console.log('ERROR', err);
						// 		}
						// 	});

						// Subscribe to my presence:
						var me = application._embedded.me.uri;
						var sub = 'https://uccweb.finnova.com' + application._embedded.people._links.presenceSubscriptions.href;
						superagent
							.post(sub)
							.set('Authorization', 'Bearer ' + token)
							.send({
								duration: 11,
								uris: [ me ]
							})
							.end(function(err, res) {
								if(err) {
									console.log('ERROR', err);
								}
							});
					});


			});
	})
	.catch(function(err) {
		console.log('error :(', err);
	});



