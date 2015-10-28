var debug = require('debug')('ucwajs:events');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var superagent = require('superagent');

function Events(token) {
	debug('Create Events instance');
	
	this.token = token;
	this.stop = false;
	
	EventEmitter.call(this);
}
util.inherits(Events, EventEmitter);


Events.prototype.start = function(eventsLink) {
	debug('Start');
	
	var self = this;
	var longPoll = function(eventsLink) {
		debug('Initiate long poll');
		superagent
			.get(eventsLink)
			.set('Authorization', 'Bearer ' + self.token)
			.end(function(err, res) {
				if(!self.stop) {
					if(err) {
						debug('Got error from long poll. Will stop now.');
						self.emit('error', err);
					} else {
						debug('Got event from long poll. Emitting it now.');
						self.emit('event', res.body.sender);
						longPoll('https://uccweb.finnova.com' + res.body._links.next.href);
					}
				} else {
					debug('Stop was true. Do not restart long poll');
				}
			});
	};

	this.stop = false;
	longPoll(eventsLink);
};

Events.prototype.stop = function() {
	debug('Stop');
	this.stop = true;
};



module.exports = Events;