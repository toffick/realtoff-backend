const EventEmitter = require('events');
const redis = require('redis');


class EventBus extends EventEmitter {

	/**
	 *
	 * @param {Object} config
	 */
	constructor({ config }) {
		super();

		this.prefix = config.environment;

		this.pub = redis.createClient({ db: config.redis.db });
		this.sub = redis.createClient({ db: config.redis.db });

		this._initListeners();
		this.initSubscriptions();

	}

	_initListeners() {
		this.sub.on('message', (channel, message) => {
			this._processChannel(channel, message);
		});
	}


	/**
	 *
	 * @param {String} channel
	 * @param {String} message
	 */
	_processChannel(channel, message) {
		const { EVENTS: events } = EventBus;

		switch (channel) {
			case this._getChannelName(events.USER.NEW_OFFER):
				this.emit(events.USER.NEW_OFFER, message);
				break;
			case this._getChannelName(events.USER.REGISTRATION):
				this.emit(events.USER.REGISTRATION, message);
				break;
			default:
		}

	}

	/**
	 *
	 * @param {String} event
	 * @return {*}
	 * @private
	 */
	_getChannelName(event) {
		return `${this.prefix}_${event}`;
	}

	/**
	 *
	 * @param {String} channel
	 * @param {String} message
	 */
	publishEvent(channel, message) {
		this.pub.publish(this._getChannelName(channel), message);
	}


	initSubscriptions() {
		this.sub.on('subscribe', () => { });

		const { EVENTS: events } = EventBus;

		this._subToEvents(events);
	}


	/**
	 *
	 * @param {Object} events
	 */
	_subToEvents(events) {
		Object.keys(events).forEach((eventName) => {

			const event = events[eventName];

			if (Object.prototype.toString.call(event) === '[object Object]') {
				this._subToEvents(event);
			} else if (typeof event === 'string') {
				this.sub.subscribe(this._getChannelName(event));
			}

		});
	}


}

EventBus.EVENTS = {
	USER: {
		NEW_OFFER: 'NEW_OFFER',
		REGISTRATION: 'REGISTRATION',
	},
};

module.exports = EventBus;
