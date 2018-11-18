'use strict';
module.exports = function resultToAppId(event, result) {
	return result.Id || event.PhysicalResourceId;
};

