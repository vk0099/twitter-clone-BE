import { userSchema } from './user-schema';
import {
	validateEmail,
	hashPassword,
	comparePassword,
	jwt_create
} from '../utils/utils';
import { APIError } from '../utils/custom-error';

export async function signUp({
	email,
	password,
	name
}: {
	email: string;
	password: string;
	name: string;
}) {
	try {
		// let { email, password, name } = objbody;
		if (!email || !password) {
			throw new Error('Please fill all the mandatory fields');
		}
		if (!validateEmail(email)) throw new Error('Please enter valid email.');
		let isExist = await userSchema.findOne({ email: email });
		if (isExist) {
			throw new Error('User is already exists');
		}
		let hashedPassword = hashPassword(password);
		let success = await userSchema.create({
			email: email,
			name: name,
			password: hashedPassword
		});

		return { ...success.toJSON(), message: 'user created sucessfully' };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function login({ email, password }) {
	try {
		if (!email && !password) {
			throw new Error('Please fill all the mandatory fields');
		}
		let isExist = await userSchema.findOne({ email: email });
		let result = comparePassword(password, isExist.password);
		if (!result) {
			throw new Error('Please enter valid login credentials.');
		}
		let token = await jwt_create(email);
		let updateToken = await userSchema.findByIdAndUpdate(
			isExist._id,
			{ $set: { token: token } },
			{ new: true }
		);
		return { updateToken };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function logout(userObj) {
	try {
		if (userObj) {
			return await userSchema.findByIdAndUpdate(
				userObj._id,
				{ $set: { token: null } },
				{ new: true }
			);
		} else {
			throw new APIError('user was not able to logout', 400);
		}
	} catch (error) {
		throw error;
	}
}
