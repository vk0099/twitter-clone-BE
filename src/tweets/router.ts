import { OK } from 'http-status-codes';
import { Router, NextFunction, Response, Request } from 'express';
import {
	createTweet,
	deleteTweet,
	likes,
	retweeted,
	tweets,
	tweetsOfUser,
	unlike,
	updateTweet
} from './module';
import { APIError } from '../utils/custom-error';

const router = Router();

router.post(
	'/create',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(OK).send(await createTweet(req.body, res.user));
		} catch (err) {
			next(new Error(err.message));
		}
	}
);

//  USER REGISTER URI
router.post(
	'/update',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(OK).send(await updateTweet(req.body, res.user));
		} catch (err) {
			next(new Error(err.message));
		}
	}
);

router.post(
	'/delete',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(OK).send(await deleteTweet(req.body, res.user));
		} catch (error) {
			next(new Error(error.message));
		}
	}
);

router.get(
	'/allTweets',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(OK).send(await tweets());
		} catch (error) {
			next(new Error(error.message));
		}
	}
);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(OK).send(await tweetsOfUser(res.user));
	} catch (error) {
		next(new Error(error.message));
	}
});

router.post(
	'/like',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(200).send(await likes(req.body, res.user));
		} catch (error) {
			next(new APIError(error.message, error.code));
		}
	}
);

router.post(
	'/unlike',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(200).send(await unlike(req.body, res.user));
		} catch (error) {
			next(new Error(error));
		}
	}
);

router.post(
	'/retweet',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(200).send(await retweeted(req.body, res.user));
		} catch (error) {
			next(new Error(error));
		}
	}
);

export = router;
