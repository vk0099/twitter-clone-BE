import app = require('./app');
import loginRoute = require('./users/router');
import tweetRoute = require('./tweets/router');
import authenticate from './utils/autheticat';

const PREFIX = '/api/v1';

export = (app) => {
	app.use(`${PREFIX}/login`, loginRoute);
	app.use(`${PREFIX}/logout`, authenticate, loginRoute);
	app.use(`${PREFIX}/tweet`, authenticate, tweetRoute);

	app.use((req, res, next) => {
		res.send({
			errors: [
				{ code: 404, message: 'Undefined endpoint url ' + req.baseUrl }
			]
		});
	});

	// ERROR HANDLER
	app.use((error: Error, req: any, res: any, next: any) => {
		var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		console.error(
			` API: ${fullUrl},\n Message: ${error.message}\n Trace: ${error.stack}`
		);
		res.status(
			(error as any).code < 600 ? (error as any).code : 500 || 500
		).send({ errors: error.message || (error as any).error });
	});
};
