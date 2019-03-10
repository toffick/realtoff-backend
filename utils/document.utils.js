/**
 * @param {MongooseDocument} document
 * @param {Object} update
 * @return {Promise<MongooseDocument>}
 */
const updateDocumentIfNeeded = async (document, update) => {
	let shouldSave = false;
	Object.keys(update).forEach((propKey) => {
		const prop = update[propKey];
		if (prop !== document[propKey]) {
			shouldSave = true;
			document[propKey] = prop;
		}
	});
	if (!shouldSave) return document;
	await document.save();
	return document;
};

/**
 * Removes all field _id recursive
 * @param {Object} obj
 */
const objectIdDelete = (obj) => {
	if (obj != null && !['string', 'number', 'boolean'].includes(typeof obj)) {
		// for array length is defined however for objects length is undefined
		if (typeof (obj.length) === 'undefined') {
			delete obj._id;
			Object.keys(obj).forEach((key) => {
				objectIdDelete(obj[key]); // recursive del calls on object elements
			});
		} else {
			Object.keys(obj).forEach((key) => {
				objectIdDelete(obj[key]); // recursive del calls on object elements
			});
		}
	}
};

module.exports = {
	updateDocumentIfNeeded,
	objectIdDelete,
};
