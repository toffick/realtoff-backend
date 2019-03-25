const APPLICATION_TYPES = {
	ASIC_APP: 'asic_app',
	RIG_APP: 'rig_app',
	WEB_APP: 'web_app',
};

const WORKER_TYPES = {
	ASIC_APP: APPLICATION_TYPES.ASIC_APP,
	RIG_APP: APPLICATION_TYPES.RIG_APP,
	THIRD_PARTY: 'third_party',
	BENCHMARK: 'benchmark',
};


module.exports = {
	PASSWORD_MIN_LENGTH: 6,

	STATISTICS: {
		ACTIVE_SETUPS_MINING_CONFIGURATION: 'statistics:active_setups_mining_configuration',
		ACTIVE_SETUPS_MINING_STATISTICS: 'statistics:active_setups_mining_statistics',
		USER_ACTIVE_MINING_SETUPS: 'statistics:user_active_mining_setups',
		SETUPS_CONNECTIONS_COUNTER: 'statistics:setup_connection_counter',
		USER_ONLINE_WORKER_IDS: 'statistics:user_online_worker_ids',
		HASHRATE_SORTED_SET: 'statistics:hashrate_sorted_set',
		SETUP_HASHRATE_IS_BEING_CALCULATED: 'statistics:setup_hashrate_is_being_calculated',
		HASHRATE_SORTED_SET_DELIMITER: '_',
		SETUP_HASHRATE_PER_INTERVAL: 'statistics:setup_hashrate_per_interval',
	},

	SETUPS_CONNECTED_VIA_STRATUM: 'stratum:setups_connected_via_stratum',

	TOKEN_TYPES: {
		REFRESH: 'refresh',
		ACCESS: 'access',
	},

	WITHDRAWAL_STATUSES: {
		WAIT_APPROVE: 'wait_approve',
		APPROVED: 'approved',
		APPROVED_IN_PROCESS: 'approved_in_process',
		REJECTED: 'rejected',
		REJECTED_IN_PROCESS: 'rejected_in_process',
		REJECTED_PROCESSED: 'rejected_processed',
		// IN_PROCESS: 'in_process',
		UNCONFIRMED: 'unconfirmed',
		UNCONFIRMED_IN_PROCESS: 'unconfirmed_in_process',
		CONFIRMED: 'confirmed',
		// ERROR: 'error',
		ERROR_APPROVED: 'error_approved',
		ERROR_UNCONFIRMED: 'error_unconfirmed',
		ERROR_REJECTED: 'error_rejected',
		NOT_ENOUGH_BALANCE: 'not_enough_balance',
	},

	HANDLE_WITHDRAWAL_REQUESTS_AMOUNT_PER_TIME: 5,

	EXCHANGE_ORDER_STATUSES: {
		NEW: 'new',
		NEW_IN_PROCESS: 'new_in_process',
		OPEN: 'open',
		OPEN_IN_PROCESS: 'open_in_process',
		DONE: 'done',
		ERROR: 'error',
		NOT_ENOUGH_BALANCE: 'not_enough_balance',
	},

	CONFIRMED_REWARD_STATUSES: {
		NEW: 'new',
		PROCESSED: 'processed',
		ERROR: 'error',
	},

	UNCONFIRMED_REWARD_STATUSES: {
		NEW: 'new',
		MATURE: 'mature',
		CONVERTED: 'converted',
		KICKED: 'kicked',
		ORPHANED: 'orphaned',
		BLOCK_SOLUTION_DOESNT_MATCH_TX_BLOCKHASH: 'block_solution_doesnt_match_tx_blockhash',
		ERROR: 'error',
	},

	USER_STATUSES: {
		ACTIVE: 'active',
		NOT_ACTIVE: 'not_active',
	},

	EMAIL_STATUSES: {
		UNCHANGED: 'unchanged',
		CHANGED: 'changed',
		ERROR: 'error',
	},

	MINED_BLOCK_STATUSES: {
		NEW: 'new',
		NEW_IN_PROCESS: 'new_in_process',
		UNCONFIRMED_PROCESSED: 'unconfirmed_processed',
		ORPHANED: 'orphaned',
		KICKED: 'kicked',
		SOLUTION_DOESNT_MATCH_TX_BLOCKHASH: 'solution_doesnt_match_tx_blockhash',
		MINED: 'mined',
		MINED_IN_PROCESS: 'mined_in_process',
		MINED_PROCESSED: 'mined_processed',
		ERROR: 'error',
		REWARD_PENDING: 'reward_pending',
		GENERATE: 'generate',
	},

	SHARE_STATUSES: {
		NEW: 'new',
		PROCESSED: 'processed',
	},

	SHARE_TYPES: {
		ACCEPTED: 'accepted',
		REJECTED: 'rejected',
		STALE: 'stale',
	},

	EXCHANGES: {
		POLONIEX: 'poloniex',
		BITTREX: 'bittrex',
		BITFINEX: 'bitfinex',
	},

	USER_PERMISSIONS: {
		DEFAULT: 0,
		WITHDRAWAL: 1,
		ENABLE_TFA: 2,
		DISABLE_TFA: 3,
		SIGN_IN: 4,
		CHANGE_PASSWORD: 5,
		CHANGE_EMAIL: 6,
		MANUAL_COIN_CONVERSION: 7,
		TOGGLE_CONVERSION: 8,
	},

	USER_WORKER_STATUSES: {
		IDLE: 'idle',
		WORKING: 'working',
		BENCHMARKING: 'benchmarking',
		LOW_HASHRATE: 'low hashrate',
		DEAD: 'dead',
	},

	USER_WALLET_ACTIONS: {
		PROXY_REWARD: 'proxy_reward',
		CONFIRMED_BLOCK_REWARD: 'confirmed_block_reward',
		UNCONFIRMED_BLOCK_REWARD: 'unconfirmed_block_reward',
		WITHDRAWAL_REQUEST: 'withdrawal_request',
		WITHDRAWAL: 'withdrawal',
		REJECTED_WITHDRAWAL: 'rejected_withdrawal',
		PENDING_CONVERSION: 'pending_conversion',
		CONVERSION: 'conversion',
		INVALID_BLOCK_UNCONFIRMED_REWARD: 'invalid_block_unconfirmed_reward',
	},

	MINING_TYPES: {
		DEFAULT: 'default',
		AUX: 'aux',
	},

	MINING_ROUND_STATUSES: {
		NEW: 'new',
		IN_PROCESS: 'in_process',
		ERROR: 'error',
		PROCESSED: 'processed',
		NO_EARNINGS: 'no_earnings',
	},

	MINING_ROUND_TYPES: {
		DEFAULT: 'default',
		PROXY: 'proxy',
	},

	SIGMAPOOL_EARNINGS_STATUSES: {
		NEW: 'new',
		IN_PROCESS: 'in_process',
		ERROR: 'error',
		PROCESSED: 'processed',
	},

	APPLICATION_TYPES,
	WORKER_TYPES,

	MINING_STATISTICS_EVENTS: {
		ASIC_APP_OFFLINE: 'asic-app-offline',
		ASIC_APP_ONLINE: 'asic-app-online',
		DELETE_DESKTOP_APP_SETUPS: 'delete-desktop-app-setups',
		NEW_SHARE: 'new-share',
		SHOW_ASIC_APP_DEVICES: 'show-asic-app-devices',
		SHOW_DESKTOP_APP_SETUPS: 'show-desktop-app-setups',
		WORKER_CONNECTED: 'worker-connected',
		WORKER_DISCONNECTED: 'worker-disconnected',
	},

	ROLES: {
		USER: 1,
		ADMIN: 2,
	},

	EMAIL_CHANGE_DELAY: 300,
};
