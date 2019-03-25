

class UserTokenRepository {

	constructor({ dbConnection }) {
		this.models = dbConnection.models;
	}

	/**
	 *
	 * @param {Number} userId
	 * @param {String} accessToken
	 * @param {String} refreshToken
	 * @return {Promise.<*>}
	 */
	async createUserToken(userId, refreshToken) {

		const user = await this.models.UserToken.create({
			user_id: userId, refresh_token: refreshToken,
		});

		return user;
	}

	/**
	 *
	 * @param {String} refreshToken
	 * @return {Promise.<void>}
	 */
	async fetchUserTokenByRefreshToken(refreshToken) {

		const userToken = await this.models.UserToken.findOne({
			where: {
				refresh_token: refreshToken,
			},
		});

		return userToken;
	}

	/**
	 *
	 * @param {String} refreshToken
	 * @return {Promise.<*>}
	 */
	async removeUserToken(refreshToken) {

		return this.models.UserToken.destroy({
			where: {
				refresh_token: refreshToken,
			},
		}).then(() => true);

	}

	/**
	 *
	 * @param {String} userTokenId
	 * @param {String} refreshToken
	 * @return {Promise.<*>}
	 */
	async updateUserRefreshToken(userTokenId, refreshToken) {

		const userToken = await this.models.UserToken.update({
			refresh_token: refreshToken,
		}, {
			where: {
				id: userTokenId,
			},
		});

		return userToken;
	}

}

module.exports = UserTokenRepository;
