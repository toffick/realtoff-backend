const cron = require('node-cron');

class CronModule {

	/**
	 *
	 * @param {ReportJob} reportJob
	 */
	constructor({ reportJob }) {
		this.reportJob = reportJob;
	}

	initModule() {
		cron.schedule('0 * * * *', () => this.reportJob.someMethod(), true);
	}

}

module.exports = CronModule;
