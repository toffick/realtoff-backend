module.exports = (text) => text.replace(/([а-яё])|([\s_-])|([^a-z\d])/gi,
	(all, ch, space, words) => {
		if (space || words) {
			return space ? '-' : '';
		}
		const code = ch.charCodeAt(0);
		const index = (code === 1025 || code === 1105) ? 0
			: code > 1071 ? code - 1071 : code - 1039;
		const t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh',
			'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
			'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh',
			'shch', '', 'y', '', 'e', 'yu', 'ya',
		];
		return t[index];
	});
