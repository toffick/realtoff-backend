const nodemailer = require('nodemailer');
const logger = require('log4js').getLogger('EmailTransporter');

logger.level = 'debug';

class EmailTransporter {

	/**
	 * @param {Object} config
	 * @param {Object} config.EMAIL_SETTINGS
	 * @param {Object} config.EMAIL_SETTINGS.TRANSPORTER
	 * @param {String} config.EMAIL_SETTINGS.TRANSPORTER.HOST
	 * @param {Number} config.EMAIL_SETTINGS.TRANSPORTER.PORT
	 * @param {Boolean} config.EMAIL_SETTINGS.TRANSPORTER.SECURE
	 * @param {Object} config.EMAIL_SETTINGS.TRANSPORTER.AUTH
	 * @param {String} config.EMAIL_SETTINGS.TRANSPORTER.AUTH.USER
	 * @param {String} config.EMAIL_SETTINGS.TRANSPORTER.AUTH.PASSWORD
	 * @param {String} config.EMAIL_SETTINGS.TRANSPORTER.SENDER
	 * @param {String} config.EMAIL_SETTINGS.SUBJECT_PREFIX
	 */
	constructor({ config }) {

		this.config = config;

		this.transporter = nodemailer.createTransport({
			host: this.config.EMAIL_SETTINGS.TRANSPORTER.HOST,
			port: this.config.EMAIL_SETTINGS.TRANSPORTER.PORT,
			secure: this.config.EMAIL_SETTINGS.TRANSPORTER.SECURE, // secure:true for port 465, secure:false for port 587
			auth: {
				user: this.config.EMAIL_SETTINGS.TRANSPORTER.AUTH.USER,
				pass: this.config.EMAIL_SETTINGS.TRANSPORTER.AUTH.PASSWORD
			}
		});

	}

	/**
	 *
	 * @param {Object} mailOptions
	 * @return {Promise.<void>}
	 */
	async sendMail(mailOptions) {

		return new Promise((resolve, reject) => {

			mailOptions.subject = `${this.config.EMAIL_SETTINGS.SUBJECT_PREFIX} ${mailOptions.subject}`.trim();

			if (!mailOptions.from) {
				mailOptions.from = this.config.EMAIL_SETTINGS.TRANSPORTER.SENDER;
			}

			return this.transporter.sendMail(mailOptions, (error, info) => {

				if (error) {
					logger.error('Message error', error);
					return reject(error);
				}

				logger.info(`Message ${mailOptions.subject} sent`, info.messageId, info.response);

				return resolve(info);

			});

		});


	}

}

module.exports = EmailTransporter;
