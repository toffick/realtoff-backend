module.exports = {
	PASSWORD_MIN_LENGTH: 6,

	TOKEN_TYPES: {
		REFRESH: 'refresh',
		ACCESS: 'access',
	},

	ROLES: {
		USER: 1,
		ADMIN: 2,
	},

	REAL_TYPES: {
		HOUSE: 'house',
		FLAT: 'flat',
	},

	CURRENCY_TYPES: {
		BYN: 'BYN',
		USD: 'USD',
	},

	RENT_PERMITS: {
		SMOKE: 1,
		STUDENTS: 2,
		CHILDREN: 4,
		PETS: 8,
		PARKING: 16,
	},

	OFFER_STATUS: {
		OPEN: 'OPEN',
		CLOSED: 'CLOSED',
		BANNED: 'BANNED',
	},
};
