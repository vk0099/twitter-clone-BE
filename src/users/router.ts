import { Types } from 'mongoose';
import { OK } from 'http-status-codes';
import { Router, NextFunction, Response, Request } from 'express';
import { login, logout, signUp } from './module';
import { APIError } from '../utils/custom-error';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(OK).send(await login(req.body));
	} catch (err) {
		next(new Error(err.message));
	}
});

//  USER REGISTER URI
router.post(
	'/signUp',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(OK).send(await signUp(req.body));
		} catch (err) {
			next(new Error(err.message));
		}
	}
);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(OK).send(await logout(res.user));
	} catch (error) {
		next(new APIError(error.message, error.code));
	}
});

export = router;
