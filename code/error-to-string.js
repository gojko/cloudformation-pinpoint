'use strict';
module.exports = function errorToString(error) {
	if (!error) {
		return 'Undefined error';
	}
	if (typeof error === 'string') {
		return error;
	}
	return error.stack || error.message || JSON.stringify(error);
};

