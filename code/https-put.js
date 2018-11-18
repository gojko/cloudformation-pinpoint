'use strict';
const https = require('https'),
	urlParser = require('url');
module.exports = function httpsPut(url, body) {
	const parsedUrl = urlParser.parse(url),
		callOptions = {
			host: parsedUrl.host,
			port: parsedUrl.port,
			method: 'PUT',
			path: parsedUrl.path,
			headers: {
				'content-type': '',
				'content-length': body.length
			}
		};
	console.log('sending', callOptions, body);
	return new Promise((resolve, reject) => {
		const req = https.request(callOptions);
		req.setTimeout(10000, () => {
			const e = new Error('ETIMEDOUT');
			e.code = 'ETIMEDOUT';
			e.errno = 'ETIMEDOUT';
			e.syscall = 'connect';
			e.address = callOptions.hostname;
			e.port = callOptions.port;
			reject(e);
		});
		req.on('error', reject);
		req.on('response', (res) => {
			const dataChunks = [];
			res.setEncoding('utf8');
			res.on('data', (chunk) => dataChunks.push(chunk));
			res.on('end', () => {
				const response = {
					headers: res.headers,
					body: dataChunks.join(''),
					statusCode: res.statusCode,
					statusMessage: res.statusMessage
				};
				if ((response.statusCode > 199 && response.statusCode < 400)) {
					resolve(response);
				} else {
					reject(response);
				}
			});
		});
		req.write(body);
		req.end();
	});
};

