'use strict';
const errorToString = require('./error-to-string'),
	httpsPut = require('./https-put'),
	timeout = require('./timeout');
module.exports = function CloudFormationResource(eventAction, extractResourceId) {
	const sendResult = function (event, result) {
			const responseBody = JSON.stringify({
				Status: 'SUCCESS',
				PhysicalResourceId: extractResourceId(event, result),
				StackId: event.StackId,
				RequestId: event.RequestId,
				LogicalResourceId: event.LogicalResourceId,
				Data: result
			});
			return httpsPut(event.ResponseURL, responseBody);
		},
		sendError = function (event, error) {
			console.error(error);
			const responseBody = JSON.stringify({
				Status: 'FAILED',
				Reason: errorToString(error),
				PhysicalResourceId: event.PhysicalResourceId || `fail:${Date.now()}`,
				StackId: event.StackId,
				RequestId: event.RequestId,
				LogicalResourceId: event.LogicalResourceId
			});
			return httpsPut(event.ResponseURL, responseBody);
		};
	this.processEvent = function (event, context) {
		console.log('received', JSON.stringify(event));
		const allowedTime = context.getRemainingTimeInMillis() - 2000;
		return Promise.resolve()
			.then(() => Promise.race([timeout(allowedTime), eventAction(event, context)]))
			.then(result => sendResult(event, result))
			.catch(e => sendError(event, e))
			.catch(e => {
				console.error('error sending status', e);
				return Promise.reject(errorToString(e));
			});
	};
};
