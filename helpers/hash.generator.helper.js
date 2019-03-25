const crypto = require('crypto');

class HashGeneratorHelper {

	static async generateRandomHash(size) {

		size = size || 64;

		return new Promise((resolve, reject) => crypto.randomBytes(size, (err, buf) => {

			if (err) {
				return reject(err);
			}

			const hash = buf.toString('hex');

			return resolve(hash);

		}));

	}

}

module.exports = HashGeneratorHelper;
