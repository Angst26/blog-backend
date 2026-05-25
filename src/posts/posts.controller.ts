import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  async create(
    @Body() body: { title: string; content: string; authorId: number },
  ) {
    return this.postsService.createPost(body);
  }
  @Get()
  async findAll() {
    return this.postsService.getAllPosts();
  }
}
