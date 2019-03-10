const DEFAULT_FIELDS = {
	USER: ['id', 'name', 'email'],
};

class ExpandService {

	/**
	 * @param {UserRepository} opts.userRepository
	 */
	constructor(opts) {
		this.userRepository = opts.userRepository;
		this.user = this.user.bind(this);
	}

	/**
	 * In the Fields array, you must pass the name of the fields you want to return.
	 *
	 * If it is necessary to obtain data from another model related by objectId.
	 * For example, from the 'department' model. It is necessary to indicate this in the array of fields
	 * in a specific format and specify another function (similar to this) for the expire
	 *
	 * Example:
	 *
	 *	async user(object, fields = []) {
	 *      fields = [
	 *          'id',
	 *          'name',
	 *          'email',
	 *          {
	 * 	            field: 'department',
	 * 	            expand: [
	 * 		            'id',
	 * 		            'isActive',
	 * 		            'title',
	 * 	            ],
	 *          },
	 *      ];
	 *
	 *      .....
	 *
	 *      await this._expand([
	 *          { field: 'department', repository:
	 * this.departmentRepository, expand: (...arg) => this.department(...arg) },
	 *      ], fields, object);
	 *
	 *      ......
	 *
	 *  	return this._getObject(fields, object);
	 *  }
	 *
	 *  async department(object, fields = []) {
	 *	    if (!fields.length) {
	 *	        fields = [
	 *		        'id',
	 *		        'title',
	 *		        'isActive',
	 *	        ];
	 *      }
	 *
	 *      .....
	 *
	 *	    return this._getObject(fields, object);
	 *  }
	 *
	 * Expire user model
	 * @param {UserDocument|UserObject} object
	 * @param {Array} fields Fields for return
	 * @returns {Promise<*>}
	 */
	async user(object, fields = []) {
		if (!object) return object;

		if (!fields.length) fields = DEFAULT_FIELDS.USER;

		object.id = object._id;
		delete object._id;

		return this._getObject(fields, object);
	}

	/**
	 * Extend an object by conditions
	 * @param {Array} conditions
	 * @param {Array} fields
	 * @param {Object} object
	 * @returns {Promise<void>}
	 * @private
	 */
	async _expand(conditions, fields, object) {
		await Promise.all(conditions.map(async ({ field, repository, expand }) => {
			const option = this._findObjectField(fields, field);
			if (option) {
				if (Array.isArray(object[field])) {
					await Promise.all(object[field].map(async (item, i) => {
						object[field][i] = await repository
							.findById(item).then((result) => expand(result, option.expand));
					}));
				} else {
					object[field] = await repository
						.findById(object[field]).then((result) => expand(result, option.expand));
				}
			}
		}));
	}

	/**
	 * Extend local an object or array by conditions
	 * @param {Array} conditions
	 * @param {Array} fields
	 * @param {Object} object
	 * @returns {Promise<void>}
	 * @private
	 */
	async _expandLocal(object, conditions, fields) {
		await Promise.all(conditions.map(async ({ field, expand }) => {
			const option = this._findObjectField(fields, field);
			if (option) {
				if (Array.isArray(object[field])) {
					await Promise.all(object[field].map(async (item, i) => {
						object[field][i] = await expand(item, option.expand);
					}));
				} else if (typeof object[field] === 'object') {
					object[field] = await expand(object[field], option.expand);
				}
			}
		}));
	}

	/**
	 * Finds and returns a field object
	 * @param {Array} fields
	 * @param {String} field
	 * @returns {*}
	 * @private
	 */
	_findObjectField(fields, field) {
		return fields.find((i) => typeof i === 'object' && i.field === field);
	}

	/**
	 * Get object by fields
	 * @param {Array} fields
	 * @param {Object} object
	 * @returns {*}
	 * @private
	 */
	_getObject(fields, object) {
		return fields.reduce((obj, item) => {
			if (typeof item === 'string') {
				obj[item] = object[item];
			} else {
				obj[item.field] = object[item.field];
			}
			return obj;
		}, {});
	}

	/**
	 * checks does the field exist in fields list
	 * @param {String} field
	 * @param {Array} fields
	 * @returns {Boolean}
	 * @private
	 */
	_hasField(field, fields) {
		return fields.some((one) => one === field || (typeof one === 'object' && one.field === field));
	}

	/**
	 * generates null object by fields array
	 * @param {Array} fields
	 * @returns {*}
	 * @private
	 */
	_generateNullObject(fields = []) {
		return fields.reduce((result, field) => {
			result[field] = null;
			return result;
		}, {});
	}

}

module.exports = ExpandService;
