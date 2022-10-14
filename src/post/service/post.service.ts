import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreatePostDto } from '../dto/post.dto';
import { PostRespository } from '../responsitories/post.responsitory';

@Injectable()
export class PostService {
  constructor(private readonly postRespository: PostRespository) {}

  getAllPosts() {
    return this.postRespository.getByCondition({});
  }

  async getId(id: string) {
    const check = Types.ObjectId.isValid(id);
    if (!check)
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);

    const post = await this.postRespository.findById(id);
    if (post) {
      return post;
    }
    throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);
  }

  async getQuery(request: any) {
    const { id } = request;
    const check = Types.ObjectId.isValid(id);
    if (!check)
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);
    const post = await this.postRespository.findById(id);
    if (post) {
      return post;
    }
    throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto) {
    const newPost = {
      content: post.content,
      title: post.title,
    };
    await this.postRespository.create(newPost);
    return newPost;
  }
}
