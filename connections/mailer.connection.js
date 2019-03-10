const nodemailer = require('nodemailer');
const BaseConnection = require('./abstracts/base.connection');

class MailerConnection extends BaseConnection {

	/**
	 * @param {Object} opts
	 * @param {AppConfig} opts.config
	 * @param {RavenHelper} opts.ravenHelper
	 */
	constructor(opts) {
		super();
		this.config = opts.config.mailer;
		this.ravenHelper = opts.ravenHelper;
		this._transporter = null;
	}

	/**
	 * @param {String} to
	 * @param {String} subject
	 * @param {String} text
	 * @param {String} html
	 * @return {Promise<*>}
	 * @throws 'can not send mail'
	 */
	async sendMail(to, subject, text, html = null) {
		const mailParams = {
			from: this.config.user,
			to,
			subject,
			text,
		};
		if (html) {
			mailParams.html = html;
		}
		try {
			return await this._transporter.sendMail(mailParams);
		} catch (err) {
			throw this.ravenHelper.error(
				new Error('can not send mail'),
				'mailerService.sendMail',
				{ ...mailParams, err },
			);
		}
	}

	connect() {
		this._transporter = nodemailer.createTransport({
			service: this.config.service,
			auth: {
				user: this.config.user,
				pass: this.config.pass,
			},
		});
	}

	disconnect() {
	}

}

module.exports = MailerConnection;
