const config = require('config');

// TODO object from url
module.exports = {
	[config.environment]: config.db,
};
