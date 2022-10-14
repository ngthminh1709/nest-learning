/* eslint-disable prettier/prettier */
import { Document, Schema } from 'mongoose';
import { User } from 'src/user/models/user.model';

const PostSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    collection: 'posts',
  },
);

export { PostSchema };

export interface Post extends Document {
  title: string;
  content: string;
  user: User;
}
