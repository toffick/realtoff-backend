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
			case this._getChannelName(events.MINED_BLOCK.NEW):
				this.emit(events.MINED_BLOCK.NEW, message);
				break;
			case this._getChannelName(events.MINED_BLOCK.MINED):
				this.emit(events.MINED_BLOCK.MINED, message);
				break;
			case this._getChannelName(events.MINED_BLOCK.REWARD_PENDING):
				this.emit(events.MINED_BLOCK.REWARD_PENDING, message);
				break;
			case this._getChannelName(events.STATS.STATS_UPDATED):
				this.emit(events.STATS.STATS_UPDATED, message);
				break;
			case this._getChannelName(events.STATS.NEW_SHARE):
				this.emit(events.STATS.NEW_SHARE, message);
				break;
			case this._getChannelName(events.STATS.SETUP_CONNECTED):
				this.emit(events.STATS.SETUP_CONNECTED, message);
				break;
			case this._getChannelName(events.STATS.SETUP_DISCONNECTED):
				this.emit(events.STATS.SETUP_DISCONNECTED, message);
				break;
			case this._getChannelName(events.STATS.SETUP_SHARE_SUBMITTED):
				this.emit(events.STATS.SETUP_SHARE_SUBMITTED, message);
				break;
			case this._getChannelName(events.STATS.DESKTOP_APP_CONNECTED):
				this.emit(events.STATS.DESKTOP_APP_CONNECTED, message);
				break;
			case this._getChannelName(events.STATS.DESKTOP_APP_DISCONNECTED):
				this.emit(events.STATS.DESKTOP_APP_DISCONNECTED, message);
				break;
			case this._getChannelName(events.STATS.WORKER_CONNECTED):
				this.emit(events.STATS.WORKER_CONNECTED, message);
				break;
			case this._getChannelName(events.STATS.WORKER_DISCONNECTED):
				this.emit(events.STATS.WORKER_DISCONNECTED, message);
				break;
			case this._getChannelName(events.STATS.HASHRATE_WORKERS_GLOBAL_STATS):
				this.emit(events.STATS.HASHRATE_WORKERS_GLOBAL_STATS, message);
				break;
			case this._getChannelName(events.STATS.REWARDS_WORKERS_GLOBAL_STATS):
				this.emit(events.STATS.REWARDS_WORKERS_GLOBAL_STATS, message);
				break;
			case this._getChannelName(events.USER_ACCOUNT.EMAIL_CONFIRMED):
				this.emit(events.USER_ACCOUNT.EMAIL_CONFIRMED, message);
				break;
			case this._getChannelName(events.USER_ACCOUNT.EMAIL_CHANGED):
				this.emit(events.USER_ACCOUNT.EMAIL_CHANGED, message);
				break;
			case this._getChannelName(events.USER_ACCOUNT.TFA_ENABLED):
				this.emit(events.USER_ACCOUNT.TFA_ENABLED, message);
				break;
			case this._getChannelName(events.USER_ACCOUNT.TFA_DISABLED):
				this.emit(events.USER_ACCOUNT.TFA_DISABLED, message);
				break;
			case this._getChannelName(events.USER_ACCOUNT.TOGGLE_AUTOCONVERSION):
				this.emit(events.USER_ACCOUNT.TOGGLE_AUTOCONVERSION, message);
				break;
			case this._getChannelName(events.PROFIT_RECALCULATED):
				this.emit(events.PROFIT_RECALCULATED, message);
				break;
			case this._getChannelName(events.COIN_SWITCHING.NEW_VALID_BLOCK_SHARE):
				this.emit(events.COIN_SWITCHING.NEW_VALID_BLOCK_SHARE, message);
				break;
			case this._getChannelName(events.WALLET.CONFIRMED_BALANCE_UPDATE):
				this.emit(events.WALLET.CONFIRMED_BALANCE_UPDATE, message);
				break;
			case this._getChannelName(events.WALLET.UNCONFIRMED_BALANCE_UPDATE):
				this.emit(events.WALLET.UNCONFIRMED_BALANCE_UPDATE, message);
				break;
			case this._getChannelName(events.WITHDRAWAL.WITHDRAWAL_STATUS_CHANGE):
				this.emit(events.WITHDRAWAL.WITHDRAWAL_STATUS_CHANGE, message);
				break;
			case this._getChannelName(events.CONVERSION.NEW_CONVERSION):
				this.emit(events.CONVERSION.NEW_CONVERSION, message);
				break;
			case this._getChannelName(events.CONVERSION.ENQUEUE_CONVERSION):
				this.emit(events.CONVERSION.ENQUEUE_CONVERSION, message);
				break;
			case this._getChannelName(events.MINING_PROFIT.NEW_MINING_PROFIT):
				this.emit(events.MINING_PROFIT.NEW_MINING_PROFIT, message);
				break;
			case this._getChannelName(events.STATS.SHOW_DESKTOP_APP_SETUPS):
				this.emit(events.STATS.SHOW_DESKTOP_APP_SETUPS, message);
				break;
			case this._getChannelName(events.STATS.DELETE_DESKTOP_APP_SETUPS):
				this.emit(events.STATS.DELETE_DESKTOP_APP_SETUPS, message);
				break;
			case this._getChannelName(events.STATS.ASIC_APP_OFFLINE):
				this.emit(events.STATS.ASIC_APP_OFFLINE, message);
				break;
			case this._getChannelName(events.STATS.ASIC_APP_ONLINE):
				this.emit(events.STATS.ASIC_APP_ONLINE, message);
				break;
			case this._getChannelName(events.STATS.USER_ONLINE_WORKERS_LIST_UPDATE):
				this.emit(events.STATS.USER_ONLINE_WORKERS_LIST_UPDATE, message);
				break;
			case this._getChannelName(events.STATS.SHOW_ASIC_APP_DEVICES):
				this.emit(events.STATS.SHOW_ASIC_APP_DEVICES, message);
				break;
			case this._getChannelName(events.STATS.ASIC_APP_SETUPS_STATS_ARE_SET):
				this.emit(events.STATS.ASIC_APP_SETUPS_STATS_ARE_SET, message);
				break;
			case this._getChannelName(events.NOTIFICATION.CLIENT_DISCONNECTED):
				this.emit(events.NOTIFICATION.CLIENT_DISCONNECTED, message);
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
	MINED_BLOCK: {
		NEW: 'new-mined-block',
		MINED: 'mined-block',
		REWARD_PENDING: 'reward-pending'
	},
	STATS: {
		REWARDS_WORKERS_GLOBAL_STATS: 'REWARDS_WORKERS_GLOBAL_STATS',
		HASHRATE_WORKERS_GLOBAL_STATS: 'HASHRATE_WORKERS_GLOBAL_STATS',
		STATS_UPDATED: 'stats-updated',
		SETUP_CONNECTED: 'setup-connected',
		SETUP_DISCONNECTED: 'setup-disconnected',
		SETUP_SHARE_SUBMITTED: 'setup-share-submitted',
		DESKTOP_APP_CONNECTED: 'desktop-app-connected',
		DESKTOP_APP_DISCONNECTED: 'desktop-app-disconnected',
		SHOW_DESKTOP_APP_SETUPS: 'show-desktop-app-setups',
		DELETE_DESKTOP_APP_SETUPS: 'delete-desktop-app-setups',
		ASIC_APP_OFFLINE: 'asic-app-offline',
		ASIC_APP_ONLINE: 'asic-app-online',
		SHOW_ASIC_APP_DEVICES: 'show-asic-app-devices',
		ASIC_APP_SETUPS_STATS_ARE_SET: 'asic-app-setups-stats-are-set',
		USER_ONLINE_WORKERS_LIST_UPDATE: 'user-online-workers-list-update',
		NEW_SHARE: 'new-share',
		WORKER_CONNECTED: 'worker-connected',
		WORKER_DISCONNECTED: 'worker-disconnected'
	},
	COIN_SWITCHING: {
		NEW_VALID_BLOCK_SHARE: 'NEW_VALID_BLOCK_SHARE'
	},
	USER_ACCOUNT: {
		EMAIL_CONFIRMED: 'email-confirmed',
		EMAIL_CHANGED: 'email-chaned',
		TOGGLE_AUTOCONVERSION: 'toggle-autoconversion'
	},
	PROFIT_RECALCULATED: 'PROFIT_RECALCULATED',
	WALLET: {
		CONFIRMED_BALANCE_UPDATE: 'confirmed-balance-update',
		UNCONFIRMED_BALANCE_UPDATE: 'unconfirmed-balance-update'
	},
	WITHDRAWAL: {
		WITHDRAWAL_STATUS_CHANGE: 'withdrawal-status-change'
	},
	CONVERSION: {
		NEW_CONVERSION: 'new-conversion',
		ENQUEUE_CONVERSION: 'enqueue-conversion'
	},
	MINING_PROFIT: {
		NEW_MINING_PROFIT: 'new-mining-profit'
	},
	NOTIFICATION: {
		CLIENT_DISCONNECTED: 'client-disconnected'
	}
};

module.exports = EventBus;
