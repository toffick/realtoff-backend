const crypto = require('crypto');

class SetupTokenHelper {


	/**
	 *
	 * @param  userId
	 * @param appId
	 * @param devicesIds
	 * @return {Buffer|string}
	 */
	static getSetupToken(userId, appId, devicesIds) {

		const setupToken = crypto.createHash('ripemd160').update(`${userId}_${devicesIds.join('_')}_${appId}`).digest('hex');

		return setupToken;
	}


	/**
	 *
	 * @param {Number} userId
	 * @param {String} workerName
	 */
	static getThirdPartyWorkerHash(userId, workerName) {
		return crypto.createHash('ripemd160').update(`${userId}_${workerName}`).digest('hex');
	}


}

module.exports = SetupTokenHelper;
