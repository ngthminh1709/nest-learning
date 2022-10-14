import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDto } from '../dto/post.dto';
import { PostService } from '../service/post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Get()
  // getAllPosts() {
  //   return this.postService.getAllPosts();
  // }

  @Get('/:id')
  // getId(@Param() params: []) {
  // const id = params['id'];
  getId(@Param('id') id: string) {
    return this.postService.getId(id);
  }

  @Get()
  // getQuery(@Req() request: Request): object {
  // return this.postService.getQuery({ ...request.query });
  getQuery(@Query() query: { id: string }) {
    return this.postService.getQuery({ ...query });
  }

  @Post()
  async createPost(@Body() post: CreatePostDto) {
    return this.postService.createPost(post);
  }
}
