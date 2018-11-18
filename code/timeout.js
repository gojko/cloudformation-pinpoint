'use strict';
module.exports = function timeout(duration) {
	return new Promise((resolve, reject) => {
		setTimeout(() => reject('timeout'), duration);
	});
};
