class TestMailerConnection {

	/**
	 * @param {Object} opts
	 * @param {AppConfig} opts.config
	 * @param {RavenHelper} opts.ravenHelper
	 */
	constructor(opts) {
		this.config = opts.config.mailer;
		this.ravenHelper = opts.ravenHelper;
		this._transporter = null;
		this.mails = {};
	}

	async sendMail(to, subject, text, html) {
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
		this._transporter = {
			sendMail: (mailParams) => {
				let mailReceiver = this.mails[mailParams.to];
				if (!mailReceiver) {
					mailReceiver = [];
					this.mails[mailParams.to] = mailReceiver;
				}
				mailReceiver.push({
					from: mailParams.from,
					subject: mailParams.subject,
					text: mailParams.text,
					html: mailParams.html,
				});
				// return real info if u need
				return 'some info';
			},
		};
	}

	disconnect() {
	}

}

module.exports = TestMailerConnection;
