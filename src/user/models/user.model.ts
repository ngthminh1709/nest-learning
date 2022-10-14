/* eslint-disable prettier/prettier */
import { Document, Schema, Types } from 'mongoose';
import { Post } from 'src/post/models/post.model';

const UserSchema = new Schema(
  {
    email: { type: String },
    username: { type: String },
    password: { type: String },
    role: { type: String, default: 'user', enum: ['admin', 'user'] },
    refreshToken: { type: String, default: ''},
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'} ],
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

// UserSchema.virtual('posts', {
//   ref: 'Post',
//   localField: '_id',
//   foreignField: 'user',
//   justOne: false,
// })

export { UserSchema };

export interface User extends Document {
  email: string;
  username: string;
  password: string;
  role: string;
  refreshToken: string;
  posts: [Post];
}
