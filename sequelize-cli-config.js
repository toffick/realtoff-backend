const config = require('config');

module.exports = {
	[config.environment]: config.db,
};
