const fs = require('fs');
const handlebars = require('handlebars');

class MailerService {

	/**
	 * @param {Object} opts
	 * @param {String} opts.basePath
	 * @param {AppConfig} opts.config
	 * @param {RavenHelper} opts.ravenHelper
	 * @param {MailerConnection} opts.mailerConnection
	 */
	constructor(opts) {
		this.ravenHelper = opts.ravenHelper;
		this.config = opts.config;
		this.mailerConnection = opts.mailerConnection;
		this._templatesFolder = `${opts.basePath}/templates/mailer`;
		this._initService();
	}

	/** @typedef {String} MailType */

	/**
	 * @typedef {Object} MailTypes
	 * @property {MailType} GOT_ACCESS
	 */

	/** @returns {MailTypes} */
	get mails() {
		return { ...this._mails };
	}

	_initService() {
		this._mails = {
			GOT_ACCESS: 'gotAccess',
		};
		this._subjects = {
			[this._mails.GOT_ACCESS]: 'You got access to PPFinance',
		};
		/** @type {Object.<MailType, {html:*,plainText:*?}>} */
		this._templates = {};
		Object.keys(this._mails).map((mailName) => this._mails[mailName]).forEach((mail) => {
			this._templates[mail] = {};
			['html', 'plainText'].forEach((templateType) => {
				const templatePath = `${this._templatesFolder}/${mail}/${templateType}.handlebars`;
				this._templates[mail][templateType] = handlebars.compile(
					fs.readFileSync(templatePath).toString(),
					{ noEscape: true },
				);
			});
		});
	}

	/**
	 * @param {String} to
	 * @param {MailType} type
	 * @param {Object?} params
	 * @return {Promise<*>}
	 */
	sendMail(to, type, params) {
		const { html, plainText } = this._templates[type];
		if (!html && !plainText) {
			throw this.ravenHelper.error(new Error('no such mail-template'), 'mailer.service sendMail', { type });
		}
		const subject = this._subjects[type] || 'PPFinance';
		return this.mailerConnection.sendMail(to, subject, plainText(params), html(params));
	}

}

module.exports = MailerService;
