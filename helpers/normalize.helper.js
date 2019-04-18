class NormalizeHelper {

	static removeEmptyValuesFields(object) {
		const copyObject = { ...object };

		Object.keys(copyObject).forEach((key) => (copyObject[key].length === 0
			? delete copyObject[key]
			: null));

		return copyObject;
	}

	static removeUndefinedValuesFields(object) {
		const copyObject = { ...object };

		Object.keys(copyObject).forEach((key) => (copyObject[key] === undefined
			? delete copyObject[key]
			: null));

		return copyObject;
	}

	static camelToUnderscoreCase(camelCaseString) {
		return camelCaseString.replace(/([A-Z])/g, (_, p1) => (`_${p1.toLowerCase()}`));
	}

}

module.exports = NormalizeHelper;
