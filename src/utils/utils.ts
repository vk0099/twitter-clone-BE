import * as bcrypt from 'bcryptjs';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { APIError } from './custom-error';

export function validateEmail(email: string): Promise<boolean> {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	) as any;
}

export function hashPassword(password: string): Promise<string> {
	try {
		return bcrypt.hashSync(password, 10);
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export function comparePassword(
	password: string,
	hash_password: string
): Promise<boolean> {
	try {
		return bcrypt.compareSync(password, hash_password);
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export async function jwt_create(data: any): Promise<string> {
	return await jwtSign({ email: data }, 'KARVY_INPRO_SECRET', {
		expiresIn: '10h'
	});
}

export async function jwt_Verify(token: string): Promise<any> {
	try {
		return await jwtVerify(token, 'KARVY_INPRO_SECRET', (err, user) => {
			if (err) {
				throw new APIError('Token Expired, Please login again', 401);
			}
			return user;
		});
	} catch (err) {
		throw new APIError(err.message, err.code);
	}
}
