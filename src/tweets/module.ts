import { Mongoose, Types } from 'mongoose';
import { APIError } from '../utils/custom-error';
import { tweetSchema } from './tweet-schema';

export async function createTweet(objbody, userObj) {
	try {
		if (!objbody || !objbody.description) {
			throw new APIError('Please enter description of the tweet!', 400);
		}
		let insert_data = {
			description: objbody.description,
			userId: new Types.ObjectId(userObj['_id'])
		};
		let result = await tweetSchema.create(insert_data);
		return singleTweet(result._id);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function deleteTweet(objbody, userObj) {
	try {
		if (!objbody.tweetId) {
			throw new APIError(
				'Please select tweet which need to be deleted!',
				400
			);
		}
		let deleted = await tweetSchema.deleteOne({
			_id: new Types.ObjectId(objbody['tweetId']),
			userId: new Types.ObjectId(userObj['_id'])
		});
		if (deleted.deletedCount > 0) {
			return 'deleted sucessfully';
		} else {
			throw new APIError('tweet not found for the particular user!', 400);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function updateTweet(objbody, userObj) {
	try {
		if (!objbody.description || !objbody.tweetId) {
			throw new APIError(
				'Please enter description and tweetId of the tweet!',
				400
			);
		}
		let result = await tweetSchema.findByIdAndUpdate(objbody['tweetId'], {
			$set: { description: objbody.description }
		});
		return singleTweet(result._id);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function tweets() {
	try {
		let result = await tweetSchema.find({}).populate([
			{ path: 'userId', select: ['name', 'email'] },
			{ path: 'likes.userId', select: ['name', 'email'] }
		]);
		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function tweetsOfUser(userObj) {
	try {
		let result = await tweetSchema.find({ userId: userObj._id }).populate([
			{ path: 'userId', select: ['name', 'email'] },
			{ path: 'likes.userId', select: ['name', 'email'] }
		]);
		return result;
	} catch (error) {
		throw error;
	}
}

export async function singleTweet(id) {
	try {
		let result = await tweetSchema.findById(id).populate([
			{ path: 'userId', select: ['name', 'email'] },
			{ path: 'likes.userId', select: ['name', 'email'] }
		]);
		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function likes(objbody: Object, userObj: Object) {
	try {
		if (!objbody && !objbody['tweetId']) {
			throw new APIError('please send which tweet to like!', 400);
		}
		let liked = await tweetSchema.find({ 'likes.userId': userObj['_id'] });
		if (liked.length >= 1) {
			throw new APIError('user already liked this tweet!', 400);
		}
		await tweetSchema.findByIdAndUpdate(objbody['tweetId'], {
			$inc: { likesCount: 1 },
			$push: { likes: { userId: userObj['_id'] } }
		});
		return singleTweet(objbody['tweetId']);
	} catch (error) {
		throw error;
	}
}

export async function unlike(objbody: Object, userObj: Object) {
	try {
		if (!objbody && !objbody['tweetId']) {
			throw new APIError('please send which tweet to like!', 400);
		}
		let liked = await tweetSchema.find({ 'likes.userId': userObj['_id'] });
		if (liked.length <= 0) {
			throw new APIError('user already unliked this tweet!', 400);
		}
		await tweetSchema.findByIdAndUpdate(objbody['tweetId'], {
			$pull: { likes: { userId: userObj['_id'] } },
			$inc: { likesCount: -1 }
		});
		return singleTweet(objbody['tweetId']);
	} catch (error) {
		throw error;
	}
}

export async function retweeted(objbody: Object, userObj: Object) {
	try {
		if (!objbody && !objbody['tweetId']) {
			throw new APIError('please send which tweet to like!', 400);
		}
		let tweet = await tweetSchema.findById(objbody['tweetId']);
		let insert_data = {
			description: tweet.description,
			userId: new Types.ObjectId(userObj['_id']),
			retweeted: true
		};
		let result = await tweetSchema.create(insert_data);
		return singleTweet(result._id);
	} catch (error) {
		throw error;
	}
}
