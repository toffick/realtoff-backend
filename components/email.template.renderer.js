const Twig = require('twig');

class EmailTemplateRenderer {

	constructor({ config }) {
		this.config = config;
	}

	/**
	 *
	 * @param {String} templateName
	 * @param {Object} params
	 * @return {Promise.<void>}
	 */
	async render(templateName, params) {
		return new Promise((resolve, reject) => Twig.renderFile(`${__dirname}/../templates/${templateName}.twig`, params, (err, html) => {

			if (err) {
				return reject(err);
			}

			return resolve(html);

		}));

	}

}

module.exports = EmailTemplateRenderer;
