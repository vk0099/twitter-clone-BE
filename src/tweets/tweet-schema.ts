import * as mongoose from 'mongoose';
import { userSchema } from '../users/user-schema';

const likeSchema = new mongoose.Schema({
	userId: { type: mongoose.Types.ObjectId, ref: userSchema }
});

const schema = new mongoose.Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: userSchema },
		description: { type: String },
		likes: [{ type: likeSchema }],
		likesCount: { type: Number, default: 0 },
		retweeted: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

export const tweetSchema = mongoose.model('tweet', schema);
