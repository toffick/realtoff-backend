const config = require('config');
console.log(config.environment);
module.exports = {
	[config.environment]: config.db
};
