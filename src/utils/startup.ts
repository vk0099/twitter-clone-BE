import { userSchema } from '../users/user-schema';
import { hashPassword } from './utils';

(async function userInit(): Promise<boolean> {
	let existingUserCount: any = await userSchema.find({}).exec();
	if (!existingUserCount.length) {
		await userSchema.create(
			{
				userName: 'vamsi',
				email: 'vamsikrishnagonuguntla77@gmail.com',
				password: hashPassword('vamsi@123')
			},
			{
				userName: 'vk',
				email: 'vamsikrishnagonuguntla99@gmail.com',
				password: hashPassword('vamsi@123')
			}
		);
		console.log('No existing users found. users created successfully.');
	} else {
		console.log(`${existingUserCount.length} existing users found in DB`);
	}
	return true;
})();
