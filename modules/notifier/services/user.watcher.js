const { EVENTS } = require('../../../components/events/event.bus');

/**
 * A namespace.
 * @namespace api
 * @class UsersController
 */
class UserWatcher {

	/**
	 *
	 * @param {UserTokenRepository} userTokenRepository
	 * @param {UserRepository} userRepository
	 * @param {ErrorsHandler} errorsHandler
	 * @param {EmailTransporter} emailTransporter
	 * @param {EmailTemplateRenderer} emailTemplateRenderer
	 * @param {UsersFilterService} usersFilterService
	 * @param {EventBus} eventBus
	 */
	constructor({
		userRepository,
		errorsHandler,
		emailTransporter,
		config,
		eventBus,
		usersFilterService,
		emailTemplateRenderer,
	}) {
		this.userRepository = userRepository;

		this.config = config;
		this.errorsHandler = errorsHandler;
		this.emailTransporter = emailTransporter;
		this.emailTemplateRenderer = emailTemplateRenderer;

		this.eventBus = eventBus;
		this.usersFilterService = usersFilterService;

	}

	init() {
		this.eventBus.on(EVENTS.USER.NEW_OFFER, (message) => this.onNewOffer(message));
		this.eventBus.on(EVENTS.USER.REGISTRATION, (message) => this.onRegistration(message));
	}

	async onNewOffer(data) {

		const { offerData, offerId } = JSON.parse(data);

		const results = await this.usersFilterService.getSubscribersEmails(offerData);

		if (!results.length) {
			return;
		}

		const emails = results.map(({ email }) => email);

		const { URL_PATH_TO_PUBLIC, USER_OFFER_PAGE_URL } = this.config.EMAIL_SETTINGS;

		const url = URL_PATH_TO_PUBLIC + USER_OFFER_PAGE_URL + offerId;

		const html = await this.emailTemplateRenderer.render('emails/user_filter', {
			url,
			profileUrl: this.config.EMAIL_SETTINGS.PROFILE,
			contact_email: this.config.EMAIL_SETTINGS.CONTACT_EMAIL,
		});

		await this.emailTransporter.sendMail({
			from: this.config.EMAIL_SETTINGS.TRANSPORTER.SENDER,
			to: emails,
			subject: 'У нас появилось предложение, которое Вы искали!',
			html,
		});

	}

	async onRegistration(data) {

		const { confirmHash, email } = JSON.parse(data);

		const { URL_PATH_TO_PUBLIC, CONFIRM_EMAIL_URL, CONTACT_EMAIL } = this.config.EMAIL_SETTINGS;

		const url = URL_PATH_TO_PUBLIC + CONFIRM_EMAIL_URL + confirmHash;

		const html = await this.emailTemplateRenderer.render('emails/email_confirmation', {
			email,
			path_to_public: URL_PATH_TO_PUBLIC,
			contact_email: CONTACT_EMAIL,
			url,
		});

		await this.emailTransporter.sendMail({
			from: this.config.EMAIL_SETTINGS.TRANSPORTER.SENDER,
			to: email,
			subject: 'Email confirmation',
			html,
		});
	}

}

module.exports = UserWatcher;
