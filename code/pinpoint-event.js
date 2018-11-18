'use strict';
const aws = require('aws-sdk'),
	pinpoint = new aws.Pinpoint(),
	createApp = function (name) {
		const params = {
			CreateApplicationRequest: {
				Name: name
			}
		};
		return pinpoint.createApp(params).promise()
			.then(result => result.ApplicationResponse);
	},
	deleteApp = function (id) {
		return pinpoint.deleteApp({ApplicationId: id}).promise()
			.then(result => result.ApplicationResponse);
	};
module.exports = function handleEvent(event/*, context*/) {
	const requestType = event.RequestType;
	if (requestType === 'Create') {
		return createApp(event.ResourceProperties.Name);
	} else if (requestType === 'Update') {
		return pinpoint.deleteApp(event.PhysicalResourceId)
			.then(() => createApp(event.ResourceProperties.Name));
	} else if (requestType === 'Delete') {
		return deleteApp(event.PhysicalResourceId);
	} else {
		return Promise.reject(`Unsupported request: ${JSON.stringify(event)}`);
	}
};
