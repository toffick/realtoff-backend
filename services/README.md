# Services
Services guides

## expand.service

#### Method example
```
// DEFAULT_FIELDS.USER
// [
// 	'id',
// 	'name',
// 	'email',
// 	{
// 		field: 'department',
// 		expand: [
// 			'id',
// 			'isActive',
// 			'title',
// 		],
// 	},
// ];

/**
* @param {UserDocument|UserObject} object
* @param {Array} fields Fields for return
* @returns {Promise<Object>}
*/

async user(object, fields) {
	if (!object) return object;
	if (!fields) fields = DEFAULT_FIELDS.USER; // ['id', 'name', 'email']
	object.id = object._id;
	delete object._id;
	await this._expand([
		{ field: 'department', repository: this.departmentRepository, expand: (...arg) => this.department(...arg) },
	], fields, object);
	return this._getObject(fields, object);
}
```
**Remember!** It is an asynchronous method, you have to await it.
#### Create your own method
To create new method with its own allowed fields:
1. Copy this function and make its name unique.
2. Add to the `DEFAULT_FIELDS` constant at the beginning of the `expand.service` your default fields.

#### DEFAULT_FIELDS example
```js
const DEFAULT_FIELDS = {
   USER: ['id', 'name', 'email'],
};
```

