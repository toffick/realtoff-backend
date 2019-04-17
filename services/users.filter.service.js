const _ = require('lodash');
const NotFoundError = require('../components/errors/not.found.error');
const CustomError = require('../components/errors/custom.error');
const HashGeneratorHelper = require('../helpers/hash.generator.helper');

const { USER_ACCOUNT } = require('../components/events/event.bus').EVENTS;
const { TOKEN_TYPES } = require('../constants/constants');
const { EVENTS } = require('../components/events/event.bus');

class UsersFilterService {


	/**
	 *
	 * @param config
	 * @param eventBus
	 * @param userFilterRepository
	 */
	constructor({
		config,
		eventBus,
		userFilterRepository,
	}) {
		this.config = config;

		this.userFilterRepository = userFilterRepository;

		this.eventBus = eventBus;
	}


	async getSubscribersEmails(offerData){

	}

}


module.exports = UsersFilterService;
