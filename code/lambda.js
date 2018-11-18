'use strict';
const pinpointEvent = require('./pinpoint-event'),
	resultToAppId = require('./result-to-app-id'),
	CloudFormationResource = require('./cloudformation-resource'),
	customResource = new CloudFormationResource(pinpointEvent, resultToAppId);

exports.handler = customResource.processEvent;
